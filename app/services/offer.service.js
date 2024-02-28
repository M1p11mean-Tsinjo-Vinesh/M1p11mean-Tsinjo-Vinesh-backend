import { CrudService } from "#core/services/crud-service.js";
import { OfferModel } from "#models/offer.model.js";

export class OfferService extends CrudService {

  serviceServices;

  constructor(serviceServices) {
    super(OfferModel);
    this.serviceServices = serviceServices;
  }

  async create(data) {
    return await super.create(data);
  }

  async update(id, data) {
    return await super.update(id, data);
  }

  async remove(id) {
    const offer = await this.findById(id);
    await super.remove(id);
    this.serviceServices.remove(offer.serviceId);
  }

}
