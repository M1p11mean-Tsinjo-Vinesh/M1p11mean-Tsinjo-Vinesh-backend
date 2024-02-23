import {ReadController} from "#core/controllers/read-controller.js";
import {respond, success} from "#core/util.js";
import mongoose from "mongoose";

export class NotificationController extends ReadController {

  constructor(notificationService) {
    super(notificationService, []);
  }

  async markSeen(req, res, next) {
    try {
      await this.service.markSeen(req.user._id, req.params.id);
      respond(res, 204);
    }
    catch (e) {
      next(e);
    }
  }

  async countNotSeen(req, res, next) {
    try {
      const result = await this.service.countNotSeen(req.user._id);
      success(res, result);
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
      "userId": new mongoose.Types.ObjectId(_id)
    }
  }

  buildRouter() {
    return super.buildRouter()
      .register("put", "/:id/seen", this.markSeen.bind(this))
      .register("get", "/count/not-seen", this.countNotSeen.bind(this));
  }

}
