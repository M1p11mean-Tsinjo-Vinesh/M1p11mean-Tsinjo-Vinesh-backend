import {CrudController} from "#core/controllers/crud-controller.js";
import {RouteBuilder} from "#core/routeBuilder.js";

export class ClientController extends CrudController {

  async update(req, res, next) {
    req.paras = {
      id: req.user._id
    }
    return super.update(req, res, next);
  }

  buildRouter() {
    // only update is available for now.
    return new RouteBuilder().
      register("put", "/update", this.update.bind(this));
  }

}