import {CrudService} from "#core/services/crud-service.js";
import {ExpenseModel} from "#models/expense.model.js";

export class ExpenseService extends CrudService {

  constructor() {
    super(ExpenseModel);
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