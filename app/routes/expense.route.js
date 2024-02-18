import {ExpenseService} from "#services/expense.service.js";
import {CrudController} from "#core/controllers/crud-controller.js";

const expenseController = new CrudController(
  new ExpenseService(),
  ["year", "month", "type"]
);

export const expenseRoute = expenseController.route;