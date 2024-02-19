import {PipelineBuilder} from "#core/pipeline.builder.js";
import {AppointmentModel} from "#models/appointment.model.js";

export class SalesStatService {

  /**
   * Get total sales per day per period
   * @param year
   * @param month
   * @returns {Promise<Aggregate<Array<any>>>}
   */
  async getSalesPerDay({
    year = new Date().getFullYear(),
    month = new Date().getMonth() + 1
  }) {
    let pipelines = new PipelineBuilder()
      .filter({
        status: {
          $gte: 10
        }
      })
      .filterByPeriod("appointmentDate", year, month)
      .group({
        _id: {
          ...PipelineBuilder.buildGroupByDayFilter("appointmentDate")
        },
        sales: {$sum: "$estimatedPrice"}
      })
      .project({
        _id: 0,
        date: "$_id",
        sales: 1
      })
      .get()

    return await AppointmentModel.aggregate(pipelines);
  }

}
