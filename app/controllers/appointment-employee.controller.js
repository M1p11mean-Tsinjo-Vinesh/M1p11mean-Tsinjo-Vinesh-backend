import {ReadController} from "#core/controllers/read-controller.js";
import {CrudService} from "#core/services/crud-service.js";
import {AppointmentDetailsModel} from "#models/appointment.model.js";
import {AppointmentDetailsService} from "#services/appointment-details.service.js";
import {respond} from "#core/util.js";

export class AppointmentEmployeeController extends ReadController {

  constructor(appointmentDetailsService) {
    super(appointmentDetailsService, ["client._id", "service._id", "startDate", "status"]);
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
    if (req.user.role === "EMPLOYEE") return {
      ...filterOptions,
      "employee._id": req.user._id
    }
    return filterOptions;
  }

  buildRouter() {
    return super.buildRouter()
      .register("put", "/:id/done", this.markAppointmentElementDone.bind(this));
  }

}