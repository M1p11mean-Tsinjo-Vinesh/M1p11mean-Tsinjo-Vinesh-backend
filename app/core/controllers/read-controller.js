import {success} from "#core/util.js";
import {RouteBuilder as RouterBuilder} from "#core/routeBuilder.js";

export class ReadController {
  // The service responsible for CRUD operations
  service;

  // Express Router for CRUD routes
  route;

  /**
   * Constructor for the CrudController class.
   *
   * @param {CrudService} service - The service for CRUD operations.
   */
  constructor(service) {
    this.service = service;
    this.route = this.buildRouter().build();
  }


  /**
   * Handles the retrieval of all entities.
   *
   * @param {Express.Request} req - The Express request object.
   * @param {Express.Response} res - The Express response object.
   * @param {Express.NextFunction} next - The Express next function.
   */
  async findAll(req, res, next) {
    try {
      const {column, method} = req.query;
      const all = await this.service.findAll({column, method});
      success(res, all);
    }
    catch (e) {
      next(e)
    }
  }

  /**
   * Handles the retrieval of entities in a paginated manner.
   *
   * @param {Express.Request} req - The Express request object.
   * @param {Express.Response} res - The Express response object.
   * @param {Express.NextFunction} next - The Express next function.
   */
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
      const result = await this.service.findAllPaginated(parseInt(page), parseInt(offset), {column, method});
      success(res, result);
    }
    catch (e) {
      next(e)
    }
  }

  /**
   * Handles the retrieval of an entity by ID.
   *
   * @param {Express.Request} req - The Express request object.
   * @param {Express.Response} res - The Express response object.
   * @param {Express.NextFunction} next - The Express next function.
   */
  async findById(req, res, next) {
    try {
      const one = await this.service.findById(req.params.id);
      success(res, one);
    }
    catch (e) {
      next(e)
    }
  }

  /**
   * Builds and returns the Express Router with CRUD routes.
   *
   * @returns {RouteBuilder} The configured Express Router.
   * @private
   */
  buildRouter() {
    return new RouterBuilder()
      .register("get", '/', (...args) => this.findAllPaginated(...args))
      .register("get", '/get/all', (...args) => this.findAll(...args))
      .register("get", '/:id', (...args) => this.findById(...args));
  }
}

