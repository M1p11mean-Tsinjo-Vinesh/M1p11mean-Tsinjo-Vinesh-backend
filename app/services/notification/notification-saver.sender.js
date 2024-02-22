import {NotificationSender} from "#services/notification/notification.sender.js";

/**
 * Saves the notification into the database
 * The last that should be called if you use the decorator pattern
 */
export class NotificationSaverSender extends NotificationSender {

  notificationService

  constructor(notificationService) {
    super();
    this.notificationService = notificationService;
  }

  send(data) {
    const {
      user: {
        _id,
        email
      },
      ...rest
    } = data;
    this.notificationService.create({
      userId: _id,
      ...rest,
      date: new Date()
    });
  }

}