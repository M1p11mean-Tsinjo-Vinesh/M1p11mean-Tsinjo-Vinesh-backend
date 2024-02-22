import {CrudService} from "#core/services/crud-service.js";
import {NotificationModel} from "#models/notification.model.js";

export class NotificationService extends CrudService {

  constructor() {
    super(NotificationModel);
  }

}