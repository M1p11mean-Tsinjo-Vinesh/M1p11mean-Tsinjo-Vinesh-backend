import {CrudController} from "#core/controllers/crud-controller.js";
import {AppointmentService} from "#services/appointment.service.js";
import {RouteBuilder as RouterBuilder} from "#core/routeBuilder.js";

export class AppointmentController extends CrudController {

  constructor(employeeService, servicesService) {
    super(
      new AppointmentService(employeeService, servicesService),
      ["date", "appointmentDate", "status"]
    );
  }

  async create(req, res, next) {
    const {_id, firstName, lastName, email} = req.user;
    req.body.client = {
      _id,
      email,
      name: `${firstName} ${lastName}`
    }
    await super.create(req, res, next);
  }

  buildRouter() {
    return new RouterBuilder()
      .register("post", '/', this.create.bind(this))
      .register("get", '/', this.findAllPaginated.bind(this));
  }

}