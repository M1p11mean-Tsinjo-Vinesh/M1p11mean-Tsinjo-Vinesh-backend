import {AuthController} from "#core/controllers/auth.controller.js";
import {AuthService} from "#core/services/auth.service.js";
import {EmployeeModel} from "#models/employee.model.js";
import {CrudController} from "#core/controllers/crud-controller.js";
import {EmployeeService} from "#services/employee.service.js";

export const employeeAuthRouter = new AuthController(new AuthService(EmployeeModel)).route;

export const crudEmployee = new CrudController(new EmployeeService(EmployeeModel, ["password"])).route;
