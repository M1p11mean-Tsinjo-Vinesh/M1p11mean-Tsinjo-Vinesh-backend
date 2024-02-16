import {ReadController} from "#core/controllers/read-controller.js";
import {CrudService} from "#core/services/crud-service.js";
import {AppointmentDetailsModel} from "#models/appointment.model.js";
import {AppointmentDetailsService} from "#services/appointment-details.service.js";
import {respond} from "#core/util.js";

export class AppointmentEmployeeController extends ReadController {

  constructor() {
    super(new AppointmentDetailsService(), ["client._id", "service._id", "startDate", "status"]);
  }

  async markAppointmentElementDone(req, res, next) {
    try {
      await this.service.markAsDone(req.params.id, req.user._id);
      respond(res, 204);
    }
    catch (e) {
      next(e)
    }
  }

  createFilterOptions(req) {
    const filterOptions = super.createFilterOptions(req);
    return {
      ...filterOptions,
      "employee._id": req.user._id
    }
  }

  buildRouter() {
    return super.buildRouter()
      .register("put", "/:id/done", this.markAppointmentElementDone.bind(this));
  }

}