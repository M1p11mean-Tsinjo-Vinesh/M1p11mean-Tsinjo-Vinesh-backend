import {StatController} from "#controllers/stat.controller.js";

const statController = new StatController();
export const statRoute = statController.route;