import {AppointmentClientController} from "#controllers/appointment-client.controller.js";
import {servicesService} from "#routes/service.route.js";
import {employeeService} from "#routes/employee.route.js";

const controller = new AppointmentClientController(employeeService, servicesService);
export const appointmentRoute = controller.route;