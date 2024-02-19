import {CrudService} from "#core/services/crud-service.js";
import {AppointmentDetailsModel} from "#models/appointment.model.js";
import {BadRequest} from "#core/util.js";
import {PipelineBuilder} from "#core/pipeline.builder.js";

export class AppointmentDetailsService extends CrudService {

  constructor() {
    super(AppointmentDetailsModel);
  }

  /**
   * calculates gross profit by year
   * @param year
   * @returns {Promise<*[]>}
   */
  async getGrossProfitsByYear({year}) {
    const {day, ...monthYear} = PipelineBuilder.buildGroupByDayFilter("startDate");
    let pipelines = new PipelineBuilder()
      .filter({
        status: {
          $gt: 10
        }
      })
      .filterByPeriod("startDate", year)
      .group({
        _id: {
          ...monthYear
        },
        grossProfit: {
          $sum: {
            $multiply: [
              "$service.price",
              {
                $subtract: [1, "$service.commission"]
              }
            ]
          }
        }
      })
      .project({
        _id: 0,
        month: "$_id",
        grossProfit: 1
      })
      .get()

    const result = await AppointmentDetailsModel.aggregate(pipelines);
    const finalResult = []
    result.forEach(one => {
      finalResult[one.month.month - 1] = one.grossProfit
    })
    if(finalResult.length < 11) finalResult[11] = 0;
    return finalResult;
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