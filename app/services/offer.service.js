import {CrudService} from "#core/services/crud-service.js";
import {OfferModel} from "#models/offer.model.js";
import {ClientModel} from "#models/client.model.js";
import {notificationSender} from "#services/notification/notification-final.sender.js";
import {FO_URL, SPECIAL_OFFER_ICON} from "../static.vars.js";

export class OfferService extends CrudService {

  serviceServices;

  constructor(serviceServices) {
    super(OfferModel);
    this.serviceServices = serviceServices;
  }

  async create(data) {
    const offer = await super.create(data);
    this.createServiceFrom(offer).catch(console.log);
    this.sendNotificationToClients(offer).catch(console.log);
    return offer;
  }

  async sendNotificationToClients({
    name,
    startDate,
    endDate,
    services
  }) {
    const clients = await ClientModel.find({}, 'email');
    for(let client of clients){
      notificationSender.send({
        user: client,
        title: `Offre spéciale disponible - ${name}`,
        description: `
          Offre special disponible de ${this.formatDate(startDate)} à ${this.formatDate(endDate)},
          ${this.servicesIntoString(services)} avec une très belle réduction.
        `,
        redirectUrl: FO_URL,
        pictureUrl: SPECIAL_OFFER_ICON
      })
    }
  }

  servicesIntoString(services) {
    return services.map(service => service.name).join(' + ')
  }

  formatDate(date) {
    return new Date(date).toLocaleString('fr-FR', {
      timeZone: "Etc/GMT-3"
    });
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
