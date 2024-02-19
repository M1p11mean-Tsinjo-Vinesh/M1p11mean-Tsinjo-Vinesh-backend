import { success } from "#core/util.js";
import { RouteBuilder as RouterBuilder } from "#core/routeBuilder.js";
import { FilterOptionsBuilder } from "#core/filter-options.builder.js";

export class PreferencesController {
  employeeService;
  serviceService;
  allowedParams = ["name"];
  route;

  constructor(employeeService, serviceService) {
    this.employeeService = employeeService;
    this.serviceService = serviceService;
    this.route = this.buildRouter().build();
  }

  async findEmployees(req, res, next) {
    try {
      let { page, offset, column, method } = req.query;
      if (!page || !offset) {
        page = 1;
        offset = 10;
      }
      this.allowedParams.push("employeeType");
      req.query["eq:employeeType"] = "EMPLOYEE";
      const search = this.createFilterOptions(req);
      this.allowedParams = ["name"];
      const result = await this.employeeService.findAllPaginated(
        parseInt(page),
        parseInt(offset),
        {
          search,
          sort: { column, method },
        },
      );
      result.elements = result.elements.map((e) => {
        return {
          _id: e._id,
          fullName: e.firstName + " " + e.lastName,
          isFavorite: false,
        };
      });
      success(res, result);
    } catch (e) {
      next(e);
    }
  }

  async findServices(req, res, next) {
    try {
      let { page, offset, column, method } = req.query;
      if (!page || !offset) {
        page = 1;
        offset = 10;
      }
      const search = this.createFilterOptions(req);
      const result = await this.serviceService.findAllPaginated(
        parseInt(page),
        parseInt(offset),
        {
          search,
          sort: { column, method },
        },
      );
      result.elements = result.elements.map((e) => {
        return {
          _id: e._id,
          name: e.name,
          price: e.price,
          duration: e.duration,
        };
      });
      success(res, result);
    } catch (e) {
      next(e);
    }
  }

  createFilterOptions(req) {
    return new FilterOptionsBuilder(req.query)
      .setAllowedParams(this.allowedParams)
      .build();
  }

  buildRouter() {
    return new RouterBuilder()
      .register("get", "/employees", this.findEmployees.bind(this))
      .register("get", "/services", this.findServices.bind(this));
  }
}
