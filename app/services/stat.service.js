import {AppointmentDetailsModel} from "#models/appointment.model.js";
import mongoose from "mongoose";

export class StatService {

  /**
   * Calculates the mean working time
   * @param employeeId if only for one employee
   * @param year
   * @param month in which months
   * @returns {Promise<Aggregate<Array<any>>>}
   */
  async getMeanWorkingTime({
    employeeId,
    year = new Date().getFullYear(),
    month
  }) {
    let pipelines = []
    this.filterByEmployee(pipelines, employeeId);
    this.filterByPeriod(pipelines, parseInt(year), month);
    this.calculateWorkingTimePerDay(pipelines);
    this.calculateMean(pipelines);
    this.renameFields(pipelines);
    return await AppointmentDetailsModel.aggregate(pipelines);
  }

  filterByPeriod(pipelines, year, month) {
    let currYear = year, nextYear = year;
    let currMonth = parseInt(month ?? "1"), nextMonth = currMonth + 1;
    if(!month || month === 12) {
      nextYear++;
      nextMonth = 1;
    }
    pipelines.push({
      $match: {
        startDate: {
          $gte: new Date(`${currYear}-${String(currMonth).padStart(2, '0')}-01T00:00:00+03:00`),
          $lt: new Date(`${nextYear}-${String(nextMonth).padStart(2, '0')}-01T00:00:00+03:00`)
        }
      }
    })
  }

  renameFields(pipelines) {
    pipelines.push({
      $project: {
        _id: 0,
        employee: "$_id",
        meanWorkingTime: 1,
        sumWorkDay: 1
      }
    })
  }

  calculateMean(pipelines) {
    pipelines.push({
      $group: {
        _id: "$_id.employee",
        meanWorkingTime: { $avg: '$durationPerDay' },
        sumWorkDay: { $sum: 1 },
      },
    });
  }

  calculateWorkingTimePerDay(pipelines) {
    pipelines.push({
      $group: {
        _id: {
          employee: '$employee',
          year: { $year: '$startDate' },
          month: { $month: '$startDate' },
          day: { $dayOfMonth: '$startDate' },
        },
        durationPerDay: { $sum: '$service.duration' },
      }
    })
  }

  filterByEmployee(pipelines, employeeId) {
    if(employeeId) {
      pipelines.push({
        $match: {
          "employee._id": new mongoose.Types.ObjectId(employeeId)
        }
      })
    }
  }

}