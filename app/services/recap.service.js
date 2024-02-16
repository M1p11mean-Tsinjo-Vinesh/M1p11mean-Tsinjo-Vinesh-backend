import {AppointmentDetailsModel} from "#models/appointment.model.js";

export class RecapService {

  /**
   * Gets the progress rate of the employee on the specified date
   * with the total commission he earned
   * @param employeeId
   * @param date
   * @returns {{progress: number, commission: number}}
   */
  async getEmployeeRecap(employeeId, date = new Date()) {
    const minDate = new Date(date);
    // set to 00:00
    minDate.setHours(0, 0, 0, 0);
    const appointments = await AppointmentDetailsModel.find({
      "employee._id": employeeId,
      startDate: {
        $lt: new Date(minDate.getTime() + 24 * 60 * 60 * 1000),
        $gte: minDate
      }
    });
    const done = appointments.filter(appointment => appointment.status >= 30);
    const calculateCommissionSum = (prev, curr) => prev + (curr.service.price* curr.service.commission);
    const commission = appointments.filter(appointment => appointment.status >= 30).reduce(calculateCommissionSum, 0);
    return {
      progress: done.length/appointments.length,
      commission
    }
  }

}