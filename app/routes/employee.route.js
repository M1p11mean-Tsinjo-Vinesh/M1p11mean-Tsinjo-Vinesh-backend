import { AuthController } from "#core/controllers/auth.controller.js";
import { AuthService } from "#core/services/auth.service.js";
import { EmployeeModel } from "#models/employee.model.js";

const router = new AuthController(new AuthService(EmployeeModel)).route;

export default router;
