import {NotificationSaverSender} from "#services/notification/notification-saver.sender.js";
import {notificationService} from "#routes/notification.route.js";
import {NotificationEmailSender} from "#services/notification/notification-email.sender.js";
import {NotificationWsSender} from "#services/notification/notification-ws.sender.js";

// Decorator pattern on notification sender
// -> mail then ws then save into the database.
const notificationSaver = new NotificationSaverSender(notificationService);
const notificationWs = new NotificationWsSender(notificationSaver);
const notificationMailer = new NotificationEmailSender(notificationWs);

export const notificationSender = notificationMailer;