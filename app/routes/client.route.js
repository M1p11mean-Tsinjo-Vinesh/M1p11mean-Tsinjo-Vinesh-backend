import { AuthController } from "#core/controllers/auth.controller.js";
import { AuthService } from "#core/services/auth.service.js";
import { ClientModel } from "#models/client.model.js";
import { ClientController } from "#core/controllers/client.controller.js";

const clientAuthRoutes = new AuthController(new AuthService(ClientModel)).route;
const clientRoutes = new ClientController().route;

export default [clientAuthRoutes, clientRoutes];
