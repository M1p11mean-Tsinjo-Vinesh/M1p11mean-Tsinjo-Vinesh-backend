import {EmployeeService} from "#services/employee.service.js";
import {PreferencesController} from "#core/controllers/preferences.controller.js";
import {servicesService} from "#routes/service.route.js";

const employeeService = new EmployeeService();

const preferencesRoute = new PreferencesController(
  employeeService,
  servicesService,
).route;

export { preferencesRoute };
