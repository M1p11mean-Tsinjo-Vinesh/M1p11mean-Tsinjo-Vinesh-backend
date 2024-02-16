import {PaymentModel} from "#models/payment.model.js";
import {CrudService} from "#core/services/crud-service.js";
import {BadRequest} from "#core/util.js";

export class PaymentService {

  appointmentService;
  service;

  constructor(appointmentService) {
    this.appointmentService = appointmentService;
    this.service = new CrudService(PaymentModel);
  }

  async payAppointment(appointmentId, phoneNumber) {
    const [total] = await this.appointmentService.calculatePrice(appointmentId);
    if (total) {
      const {price} = total;
      const payment = await this.service.create({
        appointmentId,
        paid: price,
        paymentInfo: {phoneNumber},
        date: new Date()
      });
      await this.appointmentService.update(appointmentId, {status: 20});
      return payment;
    }
    throw BadRequest("Rendez-vous invalide");
  }

}