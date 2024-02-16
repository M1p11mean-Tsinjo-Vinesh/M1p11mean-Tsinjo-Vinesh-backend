import {AppointmentClientController} from "#controllers/appointment-client.controller.js";
import {servicesService} from "#routes/service.route.js";
import {employeeService} from "#routes/employee.route.js";
import {AppointmentManagerController} from "#controllers/appointment-manager.controller.js";
import {AppointmentEmployeeController} from "#controllers/appointment-employee.controller.js";
import {AppointmentController} from "#controllers/appointment.controller.js";

const appointmentClientController = new AppointmentClientController(employeeService, servicesService);
export const appointmentClientRoute = appointmentClientController.route;


const appointmentManagerController = new AppointmentManagerController(employeeService, servicesService);
export const appointmentManagerRoute = appointmentManagerController.route;


const appointmentEmployeeController = new AppointmentEmployeeController();
export const appointmentEmployeeRoute = appointmentEmployeeController.route;

export const appointmentCommonRoute = new AppointmentController().route;