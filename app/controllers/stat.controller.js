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

  async getMeanWorkingTime(req, res, next) {
    try {
      const result = await this.service.getMeanWorkingTime(req.query);
      success(res, result);
    }
    catch (e) {
      next(e);
    }
  }

  buildRouter() {
    return new RouteBuilder()
      .register("get", "/mean-working-time", this.getMeanWorkingTime.bind(this));
  }


}