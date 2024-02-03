import { AuthController } from "#core/controllers/auth.controller.js";
import { AuthService } from "#core/services/auth.service.js";
import { ClientModel } from "#models/client.model.js";
import { ClientController } from "#controllers/client.controller.js";
import { ClientService } from "#services/client.service.js";

// Create an instance of AuthController for client authentication
export const clientAuthController = new AuthController(new AuthService(ClientModel)).route;

// Create an instance of ClientController for client-related operations
export const clientRouter = new ClientController(new ClientService(ClientModel)).route;
