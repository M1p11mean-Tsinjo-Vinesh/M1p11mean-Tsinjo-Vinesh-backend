import {RecapService} from "#services/recap.service.js";
import {RouteBuilder} from "#core/routeBuilder.js";
import {success} from "#core/util.js";

export class RecapController {

  service;
  route;

  constructor() {
    this.service = new RecapService();
    this.route = this.buildRouter().build();
  }


  async getEmployeeRecap(req, res, next) {
    try {
      const result = await this.service.getEmployeeRecap(req.user._id, req.query.date);
      success(res, result);
    }
    catch (e) {
      next(e)
    }
  }

  buildRouter() {
    return new RouteBuilder()
      .register("get", "/", this.getEmployeeRecap.bind(this));
  }


}