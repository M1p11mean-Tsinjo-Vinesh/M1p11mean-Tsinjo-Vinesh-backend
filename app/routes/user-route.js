import {CrudController} from "#core/controller.js";
import {CrudService} from "#core/services/service.js";
import {UserModel} from "#models/user-model.js";


// create the routes for the CRUD of users
const router = new CrudController(new CrudService(UserModel)).route;

export default router;