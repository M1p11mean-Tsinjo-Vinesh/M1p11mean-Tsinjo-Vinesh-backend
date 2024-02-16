import {CrudService} from "#core/services/crud-service.js";
import {AppointmentDetailsModel, AppointmentModel} from "#models/appointment.model.js";
import {mailContentBuilder} from "#services/mail-content-builder.js";
import {mailer} from "#core/services/mailer.js";
import {BadRequest} from "#core/util.js";
import {AppointmentDetailsService} from "#services/appointment-details.service.js";

export class AppointmentService extends CrudService {

  employeeService;
  servicesService;
  elementService;

  constructor(employeeService, servicesService) {
    super(AppointmentModel);
    this.employeeService = employeeService;
    this.servicesService = servicesService;
    this.elementService = new AppointmentDetailsService();
  }

  /**
   * Sends a reminder via email to the client based on his appointment.
   * The provided appointment should have all its elements.
   * @param appointment
   * @returns {Promise<Awaited<unknown>[]>}
   */
  async sendAlertsForAppointment(appointment) {
    const {appointmentDate} = appointment;
    const content = mailContentBuilder.forAppointmentReminder(appointment);
    const dates = this.calculateDatesForReminder(appointmentDate);
    const recipients = [appointment.client.email]
    const subject = `[m1pp11mean-Tsinjo-Vinesh] Rappel de votre rendez vous pour le ${new Date(appointmentDate).toLocaleDateString()}`;
    return await mailer.send({dates, recipients, subject, content});
  }


  /**
   * Creates an array of date to remind the client.
   * The client will be reminded on the day this function is called,
   * in the middle of the time between the current date and the date
   * of the appointment, 10 minutes before and on the actual date
   * @param appointmentDate
   * @returns number[]
   */
  calculateDatesForReminder(appointmentDate) {
    const now = new Date().getTime();
    const date = new Date(appointmentDate).getTime();
    if (now >= date) {
      throw BadRequest("Date de rendez-vous invalide");
    }
    const diff = date - now;
    return [now, now + diff/2, date - (60000 * 10), date]
  }


  async findOne(search) {
    const found = (await super.findOne(search))?._doc;
    if (found) {
      found.elements = (await this.elementService.findAll({
        sort: {
          column: "startDate",
          method: 1
        },
        search: {
          appointmentId: found._id
        }
      })).map(elt => elt._doc);
    }
    return found;
  }

  async create(data) {
    let appointment;
    try {
      const {date, elements, ...rest} = data;
      if (!this.isAppointmentDateValid(rest.appointmentDate)) {
        throw BadRequest("Date de rendez-vous invalide");
      }
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

  isAppointmentDateValid(appointmentDate) {
    return new Date().getTime() < new Date(appointmentDate).getTime();
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