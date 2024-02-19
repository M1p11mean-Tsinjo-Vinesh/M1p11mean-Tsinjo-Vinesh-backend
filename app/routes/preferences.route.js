import { EmployeeService } from "#services/employee.service.js";
import { CrudService } from "#core/services/crud-service.js";
import { ServiceModel } from "#models/service.model.js";
import { PreferencesController } from "#core/controllers/preferences.controller.js";

const employeeService = new EmployeeService();
const serviceService = new CrudService(ServiceModel);

const preferencesRoute = new PreferencesController(
  employeeService,
  serviceService,
).route;

export { preferencesRoute };
