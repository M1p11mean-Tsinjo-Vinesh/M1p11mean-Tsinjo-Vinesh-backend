import {AuthController} from "#core/controllers/auth.controller.js";
import {AuthService} from "#core/services/auth.service.js";
import {ClientModel} from "#models/client.model.js";

// Create an instance of AuthController for client authentication
export const clientAuthController = new AuthController(new AuthService(ClientModel)).route;

