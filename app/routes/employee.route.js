import {AuthController} from "#core/controllers/auth.controller.js";
import {EmployeeModel} from "#models/employee.model.js";
import {CrudController} from "#core/controllers/crud-controller.js";
import {EmployeeAuthService, EmployeeService} from "#services/employee.service.js";

const employeeAuthRouter = new AuthController(new EmployeeAuthService(EmployeeModel)).route;
const crudEmployee = new CrudController(new EmployeeService(EmployeeModel, ["password"])).route;

export {crudEmployee, employeeAuthRouter};