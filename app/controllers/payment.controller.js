import {PaymentService} from "#services/payment.service.js";
import {RouteBuilder} from "#core/routeBuilder.js";
import {success} from "#core/util.js";

export class PaymentController {

  paymentService;
  route;

  constructor(appointmentService) {
    this.paymentService = new PaymentService(appointmentService);
    this.route = this.buildRouter().build();
  }

  async payAppointment(req, res, next){
    try {
      const result = await this.paymentService.payAppointment(req.params.id, req.body.phoneNumber);
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