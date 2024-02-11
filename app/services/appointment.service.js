import {CrudService} from "#core/services/crud-service.js";
import {AppointmentDetailsModel, AppointmentModel} from "#models/appointment.model.js";

export class AppointmentService extends CrudService {

  employeeService;
  servicesService;
  elementService;

  constructor(employeeService, servicesService) {
    super(AppointmentModel);
    this.employeeService = employeeService;
    this.servicesService = servicesService;
    this.elementService = new CrudService(AppointmentDetailsModel);
  }

  async findAllPaginated(page = 1, offset = 10, params) {
    return super.findAllPaginated(page, offset, params);
  }

  async create(data) {
    let appointment;
    try {
      const {date, elements, ...rest} = data;
      rest.date = !date ? new Date() : date;
      rest.status = 0;
      appointment = await super.create(rest);
      appointment.elements = await this.createElements(appointment, elements);
      return appointment;
    }
    catch (e) {
      if (appointment) {
        this.remove(appointment._id);
      }
      throw e;
    }
  }

  async createElements(appointment, elements) {
    const createdList = [];
    try {
      let startDate = appointment.appointmentDate;
      for (let element of elements) {
        // create element;
        await this.setElementField(element);
        element.startDate = startDate;
        element.appointmentId = appointment._id;
        element.client = appointment.client;
        createdList.push(await this.elementService.create(element));

        // update start Date for next in appointment elements
        startDate = new Date(startDate.getTime() + element.service.duration * 60000);
      }
      return createdList;
    }
    catch (e) {
      AppointmentDetailsModel.deleteMany({
        _id: {$in: createdList.map(element => element._id)}
      })
      throw e;
    }
  }


  // create one of the details of the appointment
  async setElementField(appointmentElement) {
    const {employee, service} = appointmentElement;
    appointmentElement.employee = await this.findEmployee(employee);
    appointmentElement.service = await this.findService(service);
  }

  async findEmployee(id) {
    const {firstName, lastName, email, _id}  = await this.employeeService.findById(id);
    return {
      _id,
      name: `${firstName} ${lastName}`,
      email: email
    }
  }

  async findService(id) {
    return await this.servicesService.findById(id);
  }

}