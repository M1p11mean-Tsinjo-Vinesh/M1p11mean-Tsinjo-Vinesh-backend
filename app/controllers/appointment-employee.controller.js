import {ReadController} from "#core/controllers/read-controller.js";
import {CrudService} from "#core/services/crud-service.js";
import {AppointmentDetailsModel} from "#models/appointment.model.js";

export class AppointmentEmployeeController extends ReadController {

  constructor() {
    super(new CrudService(AppointmentDetailsModel), ["client._id", "service._id", "startDate"]);
  }

  createFilterOptions(req) {
    const filterOptions = super.createFilterOptions(req);
    return {
      ...filterOptions,
      "employee._id": req.user._id
    }
  }

}