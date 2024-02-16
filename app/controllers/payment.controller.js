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
      await this.checkUser(req);
      const result = await this.paymentService.payAppointment(req.params.id, req.body.phoneNumber);
      success(res, result);
    }
    catch (e) {
      next(e)
    }
  }

  /**
   * The manager can pay any appointment if he wishes to.
   * (To allow clients to pay with cash);
   * Although, clients can only pay for theirs
   * @param req
   */
  async checkUser({user, params}) {
    if (user.role === "MANAGER") return;
    if(await this.paymentService.verifyClient(user._id, params.id)) {
      return;
    }
    throw BadRequest("Opération invalide");
  }


  buildRouter() {
    return new RouteBuilder()
      .register("put", "/appointment/:id", this.payAppointment.bind(this));
  }

}