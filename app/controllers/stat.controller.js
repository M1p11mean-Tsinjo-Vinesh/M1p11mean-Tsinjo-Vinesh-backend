import {StatService} from "#services/stat.service.js";
import {RouteBuilder} from "#core/routeBuilder.js";
import {success} from "#core/util.js";

export class StatController {

  route;
  service;

  constructor() {
    this.service = new StatService();
    this.route = this.buildRouter().build();
  }

  exposeResult(serviceFn){
    return async (req, res, next) => {
      try {
        const result = await serviceFn.call(this.service, req.query);
        success(res, result);
      }
      catch (e) {
        next(e);
      }
    }
  }

  buildRouter() {
    return new RouteBuilder()
      .register("get", "/mean-working-time", this.exposeResult(this.service.getMeanWorkingTime))
      .register("get", "/appointment-count", this.exposeResult(this.service.getAppointmentCountPerPeriod))
      .register("get", "/appointment-count-per-month", this.exposeResult(this.service.getAppointmentCountPerYear))
  }


}