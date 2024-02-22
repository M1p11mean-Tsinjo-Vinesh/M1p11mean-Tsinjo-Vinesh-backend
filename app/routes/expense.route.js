import {ExpenseService} from "#services/expense.service.js";
import {CrudController} from "#core/controllers/crud-controller.js";

export const expenseService = new ExpenseService();

const expenseController = new CrudController(
  expenseService,
  ["year", "month", "type"]
);

export const expenseRoute = expenseController.route;