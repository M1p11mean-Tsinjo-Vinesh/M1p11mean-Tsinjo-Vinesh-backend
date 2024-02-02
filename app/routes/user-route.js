import {CrudController} from "#core/controllers/crud-controller.js";
import {CrudService} from "#core/services/crud-service.js";
import {UserModel} from "#models/user-model.js";


// create the routes for the CRUD of users
const router = new CrudController(new CrudService(UserModel)).route;

export default router;