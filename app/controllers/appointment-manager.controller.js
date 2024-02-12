import {ReadController} from "#core/controllers/read-controller.js";
import {AppointmentService} from "#services/appointment.service.js";

export class AppointmentManagerController extends ReadController {

  constructor(employeeService, servicesService) {
    super(
      new AppointmentService(employeeService, servicesService),
      ["date", "appointmentDate", "status", "client._id"]
    );
  }

}