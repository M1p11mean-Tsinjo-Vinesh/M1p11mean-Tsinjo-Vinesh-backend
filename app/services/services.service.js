import {CrudService} from "#core/services/crud-service.js";
import {ServiceModel} from "#models/service.model.js";

export class ServicesService extends CrudService {

  constructor() {
    super(ServiceModel);
  }O

}