import {NotificationController} from "#controllers/notification.controller.js";
import {NotificationService} from "#services/notification/notification.service.js";

export const notificationService = new NotificationService();
const notificationController = new NotificationController(notificationService);
export const notificationRoute = notificationController.route;