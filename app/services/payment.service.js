import {PaymentModel} from "#models/payment.model.js";
import {CrudService} from "#core/services/crud-service.js";

export class PaymentService {

  appointmentService;
  service;

  constructor(appointmentService) {
    this.appointmentService = appointmentService;
    this.service = new CrudService(PaymentModel);
  }

  async findAppointment(id) {
    return await this.appointmentService.findById(id);
  }

  /**
   * Simulates payment with mobile money, when a client wants to pay for an appointment
   * they made or the manager wants to register the payment.
   * @param appointment
   * @param phoneNumber
   * @returns {Promise<*>}
   */
  async payAppointment(appointment, phoneNumber) {
    const appointmentId = appointment.id;
    const payment = await this.service.create({
      appointmentId,
      paid: appointment.estimatedPrice,
      paymentInfo: {phoneNumber},
      date: new Date()
    });
    await this.appointmentService.updateStatus(appointmentId, 20);
    return payment;
  }

}