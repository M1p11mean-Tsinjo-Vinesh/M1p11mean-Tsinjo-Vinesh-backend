export class PaymentService {

  appointmentService;

  constructor(appointmentService) {
    this.appointmentService = appointmentService;
  }

  async payAppointment(appointmentId) {
    const [result] = await this.appointmentService.calculatePrice(appointmentId);
    if (result) {
      const {price} = result;
    }
    return result;
  }

}