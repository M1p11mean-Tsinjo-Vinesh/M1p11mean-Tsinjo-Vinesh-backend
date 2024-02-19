import {AppointmentDetailsModel, AppointmentModel} from "#models/appointment.model.js";
import {PipelineBuilder} from "#services/pipeline.builder.js";

export class StatService {

  /**
   * Get appointment account per day per period
   * @param year
   * @param month
   * @returns {Promise<void>}
   */
  async getAppointmentCountPerPeriod({
    year = new Date().getFullYear(),
    month = new Date().getMonth() + 1
  }){
    let pipelines = new PipelineBuilder()
      // filter by period
      .filterByPeriod("appointmentDate", year, month)

      // group per day and get appointmentCount
      .group({
        _id: {
          ...PipelineBuilder.buildGroupByDayFilter("appointmentDate")
        },
        appointmentCount: {$sum: 1}
      })
      .get();

    return await AppointmentModel.aggregate(pipelines);
  }

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
    let pipelines = new PipelineBuilder()
      // filter by employee
      .filterByKeyId(employeeId, "employee._id")

      // filter by startDate based on year and month input
      .filterByPeriod("startDate", year, month)

      // group by employee and period to get the sum of the duration
      // per day and per employee
      .group({
        _id: {
          employee: '$employee',
          // build group-by-day clause
          ...PipelineBuilder.buildGroupByDayFilter("startDate")
        },
        durationPerDay: { $sum: '$service.duration' },
      })

      // group by employee
      // and get average of the duration per day
      .group({
        _id: "$_id.employee",
        meanWorkingTime: { $avg: '$durationPerDay' },
        sumWorkDay: { $sum: 1 },
      })

      // do projection
      // rename _id to employee
      .project({
        _id: 0,
        employee: "$_id",
        meanWorkingTime: 1,
        sumWorkDay: 1
      })
      .get();
    return await AppointmentDetailsModel.aggregate(pipelines);
  }

}