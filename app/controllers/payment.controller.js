import {PaymentService} from "#services/payment.service.js";
import {RouteBuilder} from "#core/routeBuilder.js";
import {BadRequest, success} from "#core/util.js";

export class PaymentController {

  paymentService;
  route;

  constructor(appointmentService) {
    this.paymentService = new PaymentService(appointmentService);
    this.route = this.buildRouter().build();
  }

  async payAppointment(req, res, next){
    try {
      const appointment = await this.paymentService.findAppointment(req.params.id);
      if(req.user.role !== "MANAGER") {
        // if the client did not schedule that appointment.
        if(appointment.client._id.toString() !== req.user._id) {
          throw BadRequest("Paiement invalide");
        }
      }
      const result = await this.paymentService.payAppointment(appointment, req.body.phoneNumber);
      success(res, result);
    }
    catch (e) {
      next(e)
    }
  }


  buildRouter() {
    return new RouteBuilder()
      .register("put", "/appointment/:id", this.payAppointment.bind(this));
  }

}