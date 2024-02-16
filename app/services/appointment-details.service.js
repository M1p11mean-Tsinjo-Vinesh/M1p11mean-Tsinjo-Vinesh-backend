import {CrudService} from "#core/services/crud-service.js";
import {AppointmentDetailsModel} from "#models/appointment.model.js";
import {BadRequest} from "#core/util.js";

export class AppointmentDetailsService extends CrudService {

  constructor() {
    super(AppointmentDetailsModel);
  }

  /**
   * Marks an element of an appointment as done.
   * Performed by the assigned employee.
   * @param appointmentElementsId
   * @param employeeId
   * @returns {Promise<*>}
   */
  async markAsDone(appointmentElementsId, employeeId) {
    const element = await this.findOne({
      _id: appointmentElementsId,
      "employee._id": employeeId
    });
    if (element) {
      if (element.status < 10) {
        throw BadRequest("Opération invalide: Tache non validé");
      }
      return await this.update(appointmentElementsId, {status: 30});
    }
    throw BadRequest("Rendez-vous inexistant");
  }

  async create(data) {
    data.status = 0;
    return await super.create(data);
  }

}