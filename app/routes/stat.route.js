import {StatController} from "#controllers/stat.controller.js";
import {appointmentDetailsService} from "#routes/appointment.route.js";
import {expenseService} from "#routes/expense.route.js";

const statController = new StatController(expenseService, appointmentDetailsService);
export const statRoute = statController.route;