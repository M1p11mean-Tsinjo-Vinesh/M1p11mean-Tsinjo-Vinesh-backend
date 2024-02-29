import { CrudService } from "#core/services/crud-service.js";
import { OfferModel } from "#models/offer.model.js";

export class OfferService extends CrudService {

  serviceServices;

  constructor(serviceServices) {
    super(OfferModel);
    this.serviceServices = serviceServices;
  }

  async create(data) {
    const result = await super.create(data);
    this.createServiceFrom(result).catch(console.log);
    return result;
  }

  async createServiceFrom(offer) {
    let service = await this.createServiceDataFromOffer(offer._id);
    service = await this.serviceServices.create(service);
    await OfferModel.findByIdAndUpdate(offer._id, {
      serviceId: service._id
    });
  }

  async update(id, data) {
    const result = await super.update(id, data);
    this.updateServiceFrom(result).catch(console.log);
    return result;
  }

  async updateServiceFrom(offer) {
    const service = await this.createServiceDataFromOffer(offer._id);
    await this.serviceServices.update(offer.serviceId, service);
  }

  async createServiceDataFromOffer(offerId) {
    const {
      name,
      startDate,
      endDate,
      services,
      pictureUrls
    } = (await this.findById(offerId))._doc;
    const realValue = services.reduce((prev, curr) => prev + curr.price, 0);
    const [
      duration,
      commission,
      discount
    ] = [
      services.reduce((prev, curr) => prev + curr.duration,  0),
      services.reduce((prev, curr) => prev + (curr.price * curr.commission), 0) /realValue,
      services.reduce((prev, curr) => prev + (curr.price * curr.discount), 0) / realValue
    ];
    const price = realValue - (realValue * discount);
    return {
      name,
      pictureUrls,
      duration,
      price,
      commission,
      startDate,
      endDate,
      discountInformation: {
        discountValue: discount,
        value: realValue
      }
    }
  }

  async remove(id) {
    const offer = await this.findById(id);
    await super.remove(id);
    this.serviceServices.remove(offer.serviceId);
  }

}
