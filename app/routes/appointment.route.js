import {AppointmentController} from "#controllers/appointment.controller.js";
import {servicesService} from "#routes/service.route.js";
import {employeeService} from "#routes/employee.route.js";

const controller = new AppointmentController(employeeService, servicesService);
export const appointmentRoute = controller.route;