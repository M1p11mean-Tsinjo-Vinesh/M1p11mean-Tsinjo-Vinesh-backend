import {CrudController} from "#core/controllers/crud-controller.js";
import {CrudService} from "#core/services/crud-service.js";
import {ServiceModel} from "#models/service.model.js";
import {ServicesService} from "#services/services.service.js";

export const servicesService = new ServicesService();
export const serviceCrudRoute = new CrudController(servicesService).route;
