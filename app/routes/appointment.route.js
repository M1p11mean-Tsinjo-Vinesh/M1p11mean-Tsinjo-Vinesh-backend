import {AppointmentClientController} from "#controllers/appointment-client.controller.js";
import {servicesService} from "#routes/service.route.js";
import {employeeService} from "#routes/employee.route.js";
import {AppointmentManagerController} from "#controllers/appointment-manager.controller.js";
import {AppointmentEmployeeController} from "#controllers/appointment-employee.controller.js";
import {AppointmentController} from "#controllers/appointment.controller.js";
import {AppointmentService} from "#services/appointment.service.js";


export const appointmentService = new AppointmentService(employeeService, servicesService)

const appointmentClientController = new AppointmentClientController(appointmentService);
export const appointmentClientRoute = appointmentClientController.route;


const appointmentManagerController = new AppointmentManagerController(appointmentService);
export const appointmentManagerRoute = appointmentManagerController.route;


const appointmentEmployeeController = new AppointmentEmployeeController();
export const appointmentEmployeeRoute = appointmentEmployeeController.route;

const appointmentControllerCommon = new AppointmentController(appointmentService);
export const appointmentCommonRoute = appointmentControllerCommon.route;