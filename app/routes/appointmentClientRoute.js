import {AppointmentClientController} from "#controllers/appointment-client.controller.js";
import {servicesService} from "#routes/service.route.js";
import {employeeService} from "#routes/employee.route.js";
import {AppointmentManagerController} from "#controllers/appointment-manager.controller.js";

const appointmentClientController = new AppointmentClientController(employeeService, servicesService);
export const appointmentClientRoute = appointmentClientController.route;


const appointmentManagerController = new AppointmentManagerController(employeeService, servicesService);
export const appointmentManagerRoute = appointmentManagerController.route;
