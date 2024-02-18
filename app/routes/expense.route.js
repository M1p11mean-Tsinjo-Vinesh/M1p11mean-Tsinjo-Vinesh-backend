import {CrudController} from "#core/controllers/crud-controller.js";
import {CrudService} from "#core/services/crud-service.js";
import {ExpenseModel} from "#models/expense.model.js";

const expenseController = new CrudController(
  new CrudService(ExpenseModel),
  ["year", "month", "type"]
);

export const expenseRoute = expenseController.route;