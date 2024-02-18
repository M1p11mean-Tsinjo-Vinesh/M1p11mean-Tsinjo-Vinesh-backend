import {CrudService} from "#core/services/crud-service.js";
import {AppointmentDetailsModel, AppointmentModel} from "#models/appointment.model.js";
import {mailContentBuilder} from "#services/mail-content-builder.js";
import {mailer} from "#core/services/mailer.js";
import {BadRequest} from "#core/util.js";
import {AppointmentDetailsService} from "#services/appointment-details.service.js";
import mongoose from "mongoose";

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
   * Updates the status of the appointent and its details.
   * If the appointment was already canceled, the update won't work.
   * If the appointment is validated, status can no longer be reduced.
   * @param appointmentId
   * @param status
   * @returns {Promise<void>}
   */
  async updateStatus(appointmentId, status) {
    const appointment = await this.findById(appointmentId);
    if (appointment.status < 0) throw BadRequest("Vous ne pouvez plus changer l'état de ce rendez-vous");
    if (appointment.status >= 10 && (status - appointment.status) <= 0) {
      throw BadRequest("Changement d'etat invalide");
    }
    await this.update(appointmentId, {status});
    await this.elementService.Model.updateMany({appointmentId}, {status});
  }

  /**
   * Adds comment on the appointment
   * @param appointmentId
   * @param comment
   * @returns {Promise<*>}
   */
  async addComment(appointmentId, comment) {
    return await this.update(appointmentId, {$push: {comments: comment}});
  }

  /**
   * Send alerts to a client from his appointment id
   * @param appointmentId
   * @returns {Promise<Awaited<*>[]>}
   */
  async sendAlertsForAppointmentId(appointmentId) {
    const appointment = await this.findOne({_id: appointmentId});
    return await this.sendAlertsForAppointment(appointment);
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
    const subject = `[m1pp11mean-Tsinjo-Vinesh] Rappel de votre rendez vous  le ${new Date(appointmentDate).toLocaleString()}-> ${appointment._id}`;
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


  /**
   * Finds one appointment based on filter.
   * If we find one, it will be returned with all its elements
   * @param search
   * @returns {Promise<*>}
   */
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

  /**
   * Creates on appointment with all it details
   * @param data
   * @returns {Promise<*>}
   */
  async create(data) {
    let appointment;
    try {
      const {date, elements, ...rest} = data;
      if (!this.isAppointmentDateValid(rest.appointmentDate)) {
        throw BadRequest("Date de rendez-vous invalide");
      }
      rest.date = !date ? new Date() : date;
      rest.status = 0;
      const details = await this.buildDetails(rest, elements);
      // set calculated fiels,
      // price = sum of service prices
      // duration = sum of service durations
      rest.estimatedPrice = details.reduce((prev, curr) => prev + curr.service.price, 0);
      rest.estimatedDuration = details.reduce((prev, curr) => prev + curr.service.duration, 0);

      // persist data
      appointment = await super.create(rest);
      appointment.elements = details;
      await this.createElements(appointment);
      return appointment;
    }
    catch (e) {
      if (appointment) {
        this.remove(appointment._id);
      }
      throw e;
    }
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
        const result = await this.elementService.create(element);
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
   * Verifies if the appointment Date is greater than the current date
   * @param appointmentDate
   * @returns {boolean}
   */
  isAppointmentDateValid(appointmentDate) {
    return new Date().getTime() < new Date(appointmentDate).getTime();
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
      element.client = appointment.client;
      // update start Date for next in appointment elements
      startDate = new Date(startDate.getTime() + element.service.duration * 60000);
      appointmentDetails.push(element);
    }
    return appointmentDetails;
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