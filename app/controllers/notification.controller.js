import {ReadController} from "#core/controllers/read-controller.js";
import {respond} from "#core/util.js";

export class NotificationController extends ReadController {

  constructor(notificationService) {
    super(notificationService, []);
  }

  markSeen(req, res, next) {
    try {
      this.service.markSeen(req.user._id, req.params.id);
      respond(res, 204);
    }
    catch (e) {
      next(e);
    }
  }

  createFilterOptions(req) {
    const {_id} = req.user;
    const filterOptions = super.createFilterOptions(req);
    return {
      ...filterOptions,
      "userId": _id
    }
  }

  buildRouter() {
    return super.buildRouter()
      .register("put", "/:id/seen", this.markSeen.bind(this));
  }

}
