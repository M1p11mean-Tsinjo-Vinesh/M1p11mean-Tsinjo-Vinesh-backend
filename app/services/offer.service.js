import { CrudService } from "#core/services/crud-service.js";
import { OfferModel } from "#models/offer.model.js";

export class OfferService extends CrudService {
  constructor() {
    super(OfferModel);
  }
}
