import { ReadController } from "#core/controllers/read-controller.js";
import { respond } from "#core/util.js";

export class AppointmentManagerController extends ReadController {
  constructor(appointmentService) {
    super(appointmentService, [
      "date",
      "appointmentDate",
      "status",
      "client._id",
    ]);
  }

  async validateAppointment(req, res, next) {
    try {
      await this.service.updateStatus(req.params.id, 10);
      await this.service.sendAlertsForAppointmentId(req.params.id);
      respond(res, 204);
    } catch (e) {
      next(e);
    }
  }

  async denyAppointment(req, res, next) {
    try {
      await this.service.updateStatus(req.params.id, -10);
      respond(res, 204);
    } catch (e) {
      next(e);
    }
  }

  buildRouter() {
    return super
      .buildRouter()
      .register("put", "/:id/validate", this.validateAppointment.bind(this))
      .register("put", "/:id/deny", this.denyAppointment.bind(this));
  }
}
