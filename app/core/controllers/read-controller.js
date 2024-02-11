import {success} from "#core/util.js";
import {RouteBuilder as RouterBuilder} from "#core/routeBuilder.js";
import {FilterOptionsBuilder} from "#core/filter-options.builder.js";

export class ReadController {

  // The service responsible for CRUD operations
  service;
  // Express Router for CRUD routes
  route;
  // params allowed for filter options
  allowedParams;

  constructor(service, allowedParams = []) {
    this.service = service;
    this.route = this.buildRouter().build();
    this.allowedParams = allowedParams;
  }


  async findAll(req, res, next) {
    try {
      const sort = {column, method} = req.query;
      const search = this.createFilterOptions(req);
      const all = await this.service.findAll({search, sort});
      success(res, all);
    }
    catch (e) {
      next(e)
    }
  }

  async findAllPaginated(req, res, next) {
    try {
      let { page, offset, column, method } = req.query;

      // Check if page and offset query parameters are provided
      if (!page || !offset) {
        page = 1;
        offset = 10;
        // next(BadRequest("page and offset query parameters are required"));
        // return;
      }

      // Retrieve and respond with paginated entities
      const search = this.createFilterOptions(req);
      const result = await this.service.findAllPaginated(parseInt(page), parseInt(offset), {search, sort: {column, method}});
      success(res, result);
    }
    catch (e) {
      next(e)
    }
  }

  async findById(req, res, next) {
    try {
      const search = this.createFilterOptions(req);
      search._id = req.params.id;
      const one = await this.service.findOne(search);
      success(res, one);
    }
    catch (e) {
      next(e)
    }
  }

  createFilterOptions(req) {
    return new FilterOptionsBuilder(req.query)
      .setAllowedParams(this.allowedParams)
      .build();
  }

  buildRouter() {
    return new RouterBuilder()
      .register("get", '/', (...args) => this.findAllPaginated(...args))
      .register("get", '/get/all', (...args) => this.findAll(...args))
      .register("get", '/:id', (...args) => this.findById(...args));
  }
}

