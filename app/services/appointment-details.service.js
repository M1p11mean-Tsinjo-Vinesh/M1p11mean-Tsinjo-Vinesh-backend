import {CrudService} from "#core/services/crud-service.js";
import {AppointmentDetailsModel} from "#models/appointment.model.js";

export class AppointmentDetailsService extends CrudService {

  constructor() {
    super(AppointmentDetailsModel);
  }

  async create(data) {
    data.status = 0;
    return await super.create(data);
  }

}