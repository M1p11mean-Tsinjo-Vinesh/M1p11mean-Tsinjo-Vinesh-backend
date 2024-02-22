import {NotificationSender} from "#services/notification/notification.sender.js";
import {wsManager} from "../../ws/index.js";

/**
 * Send notification with websocket
 */
export class NotificationWsSender extends NotificationSender{

  notificationSender;

  /**
   * Decorator pattern for notification Sender
   * @param notificationSender
   */
  constructor(notificationSender = undefined) {
    super();
    this.notificationSender = notificationSender;
  }

  /**
   * Send notification
   * @param data
   * {
   *   user: {
   *     _id,
   *     email
   *   },
   *   title,
   *   description,
   *   redirectUrl,
   *   pictureUrl
   * }
   */
  send(data) {
    const {
      user: {
        _id,
        email
      },
      ...rest
    } = data;
    wsManager.sendNotification(_id, rest);
    if(this.notificationSender) this.notificationSender.send(data);
  }

}