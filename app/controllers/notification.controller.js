import {ReadController} from "#core/controllers/read-controller.js";

export class NotificationController extends ReadController {

  constructor(notificationService) {
    super(notificationService, []);
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
