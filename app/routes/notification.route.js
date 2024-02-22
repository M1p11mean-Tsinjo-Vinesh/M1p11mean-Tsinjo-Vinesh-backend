import {NotificationController} from "#controllers/notification.controller.js";

const notificationController = new NotificationController();
export const notificationRoute = notificationController.route;