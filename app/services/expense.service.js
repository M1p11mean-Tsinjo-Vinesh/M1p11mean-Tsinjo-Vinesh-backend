import {CrudService} from "#core/services/crud-service.js";
import {ExpenseModel} from "#models/expense.model.js";
import {PipelineBuilder} from "#core/pipeline.builder.js";

export class ExpenseService extends CrudService {

  constructor() {
    super(ExpenseModel);
  }

  async getExpenseByYear({
    year = new Date().getFullYear()
  }) {
    let pipelines = new PipelineBuilder()
      .filter({
        year: parseInt(year)
      })
      .group({
        _id: {
          year: "$year",
          month: "$month"
        },
        expenseTotal: {$sum: "$amount"}
      })
      .project({
        _id: 0,
        month: "$_id",
        expenseTotal: 1
      })
      .get()

    const result = await ExpenseModel.aggregate(pipelines);
    const finalResult = [];
    result.forEach(one => {
      finalResult[one.month.month] = one.expenseTotal
    })
    if (finalResult.length < 11) finalResult[11] = 0;
    return finalResult;
  }

  async create(data) {
    this.setKey(data)
    return await super.create(data);
  }

  async update(id, data) {
    this.setKey(data);
    return await super.update(id, data);
  }

  setKey(data) {
    if (data.year !== undefined && data.month !== undefined)
      data.timeKey = String(data.year).padStart(6, '0') + String(data.month).padStart(2, '0');
  }

}