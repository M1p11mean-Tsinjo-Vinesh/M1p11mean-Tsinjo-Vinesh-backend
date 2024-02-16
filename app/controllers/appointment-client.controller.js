import {CrudController} from "#core/controllers/crud-controller.js";
import {AppointmentService} from "#services/appointment.service.js";
import {RouteBuilder as RouterBuilder} from "#core/routeBuilder.js";
import {BadRequest, respond} from "#core/util.js";

export class AppointmentClientController extends CrudController {

  constructor(appointmentService) {
    super(
      appointmentService,
      ["date", "appointmentDate", "status"]
    );
  }

  async cancelAppointment(req, res, next) {
    try {
      const appointment = this.service.findOne({_id: req.params.id});
      if (appointment) {
        await this.service.updateStatus(req.params.id, -10);
      }
      respond(res, 204);
    }
    catch (e) {
      next(e);
    }
  }

  createFilterOptions(req) {
    const filterOptions =  super.createFilterOptions(req);
    // only finds his own data
    filterOptions["client._id"] = req.user._id;
    return filterOptions;
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
      .register("get", '/', this.findAllPaginated.bind(this))
      .register("get", '/:id', this.findById.bind(this))
      .register("delete", "/:id", this.cancelAppointment.bind(this));
  }

}