import { success } from "#core/util.js";
import { RouteBuilder as RouterBuilder } from "#core/routeBuilder.js";
import { ClientService } from "#core/services/client.service.js";

export class ClientController {
  Service;
  route;

  constructor() {
    this.Service = new ClientService();
    this.route = this.buildRouter().build();
  }

  async checkMail(req, res, next) {
    try {
      const { email } = req.query;
      const result = await this.Service.checkMail(email);
      success(res, { available: result });
    } catch (e) {
      next(e);
    }
  }

  buildRouter() {
    return new RouterBuilder().register("get", "/checkMail", (...args) =>
      this.checkMail(...args),
    );
  }
}
