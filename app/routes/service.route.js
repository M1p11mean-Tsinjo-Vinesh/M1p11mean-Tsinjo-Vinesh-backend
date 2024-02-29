import {CrudController} from "#core/controllers/crud-controller.js";
import {ServicesService} from "#services/services.service.js";

export const servicesService = new ServicesService();
export const serviceCrudRoute = new CrudController(servicesService).route;
