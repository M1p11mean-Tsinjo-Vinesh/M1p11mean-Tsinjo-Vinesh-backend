import {ReadController} from "#core/controllers/read-controller.js";
import {NotificationService} from "#services/notification/notification.service.js";

export class NotificationController extends ReadController {

  constructor() {
    super(new NotificationService(), []);
  }

  createFilterOptions(req) {
    const {_id} = req.user;
    const filterOptions = super.createFilterOptions(req);
    return {
      ...filterOptions,
      "userId": _id
    }
  }

}
