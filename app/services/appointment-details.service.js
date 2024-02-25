import { CrudService } from "#core/services/crud-service.js";
import { AppointmentDetailsModel } from "#models/appointment.model.js";
import { BadRequest } from "#core/util.js";
import { PipelineBuilder } from "#core/pipeline.builder.js";

export class AppointmentDetailsService extends CrudService {
  employeeService;
  servicesService;

  constructor(employeeService, servicesService) {
    super(AppointmentDetailsModel);
    this.employeeService = employeeService;
    this.servicesService = servicesService;
  }

  async findEmployee(id) {
    const {firstName, lastName, email, _id, shifts}  = await this.employeeService.findById(id);
    return {
      _id,
      name: `${firstName} ${lastName}`,
      email: email,
      shifts
    }
  }

  async findService(id) {
    return await this.servicesService.findById(id);
  }

  /**
   * Creates the list of element of the appointment.
   * Saves it into the database;
   * @param appointment
   */
  async createElements(appointment) {
    const createdElements = [];
    try {
      for (let element of appointment.elements) {
        element.appointmentId = appointment._id;
        const result = await this.create(element);
        createdElements.push(result);
      }
      appointment.elements = createdElements;
    }
    catch (e) {
      AppointmentDetailsModel.deleteMany({
        _id: {$in: createdElements.map(element => element._id)}
      })
      throw e;
    }
  }

  /**
   * From (serviceId, and employeeId, and appointment information), It will set
   * all the necessary field for the AppointmentDetails model
   * @param appointment
   * @param elements
   * @returns {Promise<*[]>}
   */
  async buildDetails(appointment, elements) {
    const appointmentDetails = [];
    let startDate = new Date(appointment.appointmentDate);
    for (let element of elements) {
      // create element;
      await this.setElementField(element);
      element.startDate = startDate;
      element.endDate = new Date(new Date(startDate).getTime() + (element.service.duration * 60000))
      element.client = appointment.client;
      // verify employee availability.
      await this.checkEmployeeAvailability(element);
      // update start Date for next in appointment elements
      startDate = new Date(startDate.getTime() + element.service.duration * 60000);
      appointmentDetails.push(element);
    }
    return appointmentDetails;
  }

  // create one of the details of the appointment
  async setElementField(appointmentElement) {
    const {employee, service} = appointmentElement;
    const [employeeObject, serviceObject] = await Promise.all([this.findEmployee(employee), this.findService(service)]);
    appointmentElement.employee = employeeObject;
    appointmentElement.service = serviceObject;
  }



  /**
   * Verifies if the timeframe of the appointment element is not out of the employee's shift.
   * Verifies if the employee is not booked.
   * @param appointmentElement
   * @returns {Promise<void>}
   */
  async checkEmployeeAvailability(appointmentElement) {
    const {employee, service} = appointmentElement;
    const {duration} = service;
    const startDate = new Date(appointmentElement.startDate);
    let isInEmployeeShift = false;
    for(let shift of employee.shifts) {

      // verifies if the startDate'S day is valid
      if(shift.daysOfWeek.indexOf(startDate.getDay()) >= 0) {

        // verifies if the startDate and endDate fall into the timeframe of the employee
        const [hourMin, minuteMin] = this.timeStringToArray(shift.startTime);
        const [hourMax, minuteMax] = this.timeStringToArray(shift.endTime);
        const milliseconds = startDate.getTime();

        // start of the employee's shift
        const min = new Date(milliseconds).setHours(hourMin, minuteMin, 0, 0);

        // end of the employee's shift
        const max = new Date(milliseconds).setHours(hourMax, minuteMax, 0, 0);

        // verifies if the startDate and endDate fall into the timeframe of the employee
        if (min <= startDate && (milliseconds + duration * 60000) <= max) {
          isInEmployeeShift = true;
          break;
        }
      }
    }
    if(!isInEmployeeShift) {
      throw BadRequest("Un élément de votre rendez-vous est hors du shift de l'employée car " + this.shiftToSentenceForError(employee.shifts, employee.name));
    }
    await this.checkIfEmployeeBooked(appointmentElement);
  }

  /**
   * Verifies if the employee is not booked on the date
   * @param appointmentElement
   * @returns {Promise<void>}
   */
  async checkIfEmployeeBooked({employee, startDate, endDate}) {
    const result = await AppointmentDetailsModel.find({
      "employee._id": new mongoose.Types.ObjectId(employee._id),
      status: {
        $gte: 0
      },
      $or: [
        {
          startDate: { $lte: startDate },
          endDate: { $gt: startDate }
        },
        {
          startDate: { $lt: endDate },
          endDate: { $gte: endDate }
        }
      ]
    })
    if(result.length > 0) {
      throw BadRequest(this.bookedErrorMessage(result));
    }
  }

  bookedErrorMessage(list) {
    return list.map(({startDate, endDate, employee}) => {
      const {name} = employee;
      return `${name} est reservé entre ${new Date(startDate).toLocaleString()} et ${new Date(endDate).toLocaleString()}`;
    }).join(' et ')
  }

  /**
   * From the shift this function builds the error message
   * @param shifts
   * @param name of the employee
   */
  shiftToSentenceForError(shifts, name = undefined) {
    const days = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
    let descriptionsDesShifts = shifts.map(shift => {
      const joursDeLaSemaine = shift.daysOfWeek.map(jour => days[jour]).join(', ');
      return `${joursDeLaSemaine} de ${shift.startTime} à ${shift.endTime}`;
    });
    return `les shifts de ${name ?? "cet employé"} sont ${descriptionsDesShifts.join(' et ')}`;
  }

  /**
   * From string "hh:mm" it returns [hh, mm]
   * @param timeString
   */
  timeStringToArray(timeString) {
    return timeString.split(":").map(parseInt).map(number => isNaN(number) ? 0 : number);
  }

  /**
   * calculates gross profit by year
   * @param year
   * @returns {Promise<*[]>}
   */
  async getGrossProfitsByYear({ year }) {
    const { day, ...monthYear } =
      PipelineBuilder.buildGroupByDayFilter("startDate");
    let pipelines = new PipelineBuilder()
      .filterByValidated()
      .filterByPeriod("startDate", year)
      .group({
        _id: {
          ...monthYear,
        },
        grossProfit: {
          $sum: {
            $multiply: [
              "$service.price",
              {
                $subtract: [1, "$service.commission"],
              },
            ],
          },
        },
      })
      .project({
        _id: 0,
        month: "$_id",
        grossProfit: 1,
      })
      .get();

    const result = await AppointmentDetailsModel.aggregate(pipelines);
    const finalResult = [];
    result.forEach((one) => {
      finalResult[one.month.month - 1] = one.grossProfit;
    });
    if (finalResult.length < 11) finalResult[11] = 0;
    return finalResult;
  }

  /**
   * Marks an element of an appointment as done.
   * Performed by the assigned employee.
   * @param appointmentElementsId
   * @param employeeId
   * @returns {Promise<*>}
   */
  async markAsDone(appointmentElementsId, employeeId) {
    const element = await this.findOne({
      _id: appointmentElementsId,
      "employee._id": employeeId,
    });
    if (element) {
      if (element.status < 10) {
        throw BadRequest("Opération invalide: Tache non validé");
      }
      return await this.update(appointmentElementsId, { status: 30 });
    }
    throw BadRequest("Rendez-vous inexistant");
  }

  async create(data) {
    data.status = 0;
    return await super.create(data);
  }
}