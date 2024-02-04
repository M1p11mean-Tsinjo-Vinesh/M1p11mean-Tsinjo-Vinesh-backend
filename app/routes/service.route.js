import {CrudController} from "#core/controllers/crud-controller.js";
import {CrudService} from "#core/services/crud-service.js";
import {ServiceModel} from "#models/service.model.js";

export const serviceCrudRoute = new CrudController(new CrudService(ServiceModel)).route;