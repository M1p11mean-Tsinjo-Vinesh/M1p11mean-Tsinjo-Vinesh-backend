import {CrudService} from "#core/services/crud-service.js";
import {NotificationModel} from "#models/notification.model.js";
import mongoose from "mongoose";
import {BadRequest} from "#core/util.js";

export class NotificationService extends CrudService {

  constructor() {
    super(NotificationModel);
  }

  /**
   * Mark notification as seen.
   * @param userId
   * @param notificationId
   */
  async markSeen(userId, notificationId) {
    const notification = await this.Model.findOne({
      userId: new mongoose.Types.ObjectId(userId),
      _id: notificationId
    });
    if(notification) {
      return await this.Model.findByIdAndUpdate(notificationId, {
        ...notification._doc,
        seen: true
      })
    }
    throw BadRequest("Opération invalide");
  }

  async countNotSeen(userId) {
    return await this.Model.countDocuments({
      userId: new mongoose.Types.ObjectId(userId),
      seen: {$in: [false, undefined]}
    })
  }

}