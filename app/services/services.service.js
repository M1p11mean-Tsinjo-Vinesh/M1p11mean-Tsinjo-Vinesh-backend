import {CrudService} from "#core/services/crud-service.js";
import {ServiceModel} from "#models/service.model.js";

export class ServicesService extends CrudService {

  constructor() {
    super(ServiceModel);
  }

  filterSpecialOfferService = {
    $or: [
      {
        startDate: null,
        endDate: null
      },
      {
        startDate: {
          $lte: new Date()
        },
        endDate: {
          $gte: new Date()
        }
      }
    ]
  }

  async findAll({sort, search} = {
    sort: {},
    search: {}
  }) {
    return super.findAll({sort, search:  {
      ...search,
      ...this.filterSpecialOfferService
    }});
  }

  async findAllPaginated(page = 1, offset = 10, {sort, search} = {
    sort: {},
    search: {}
  }) {
    return super.findAllPaginated(page, offset, {sort, search:  {
        ...search,
        ...this.filterSpecialOfferService
      }});
  }

  async findOne(search) {
    return super.findOne({
    ...search,
    ...this.filterSpecialOfferService
    });
  }

  async findById(id) {
    return super.findOne({
      _id: id,
      ...this.filterSpecialOfferService
    });
  }

}