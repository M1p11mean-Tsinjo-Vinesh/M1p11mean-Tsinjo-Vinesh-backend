import { AuthController } from "#core/controllers/auth.controller.js";
import { AuthService } from "#core/services/auth.service.js";
import { ClientModel } from "#models/client.modal.js";

const router = new AuthController(new AuthService(ClientModel)).route;

export default router;