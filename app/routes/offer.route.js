import { CrudController } from "#core/controllers/crud-controller.js";
import { OfferService } from "#services/offer.service.js";
import {servicesService} from "#routes/service.route.js";

const crudOffer = new CrudController(new OfferService(servicesService)).route;

export { crudOffer };
