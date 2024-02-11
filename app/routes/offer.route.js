import { CrudController } from "#core/controllers/crud-controller.js";
import { OfferService } from "#services/offer.service.js";

const crudOffer = new CrudController(new OfferService()).route;

export { crudOffer };
