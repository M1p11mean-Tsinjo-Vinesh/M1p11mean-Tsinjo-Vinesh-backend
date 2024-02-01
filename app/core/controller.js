import { BadRequest, respond, success } from "./util.js";
import { RouteBuilder as RouterBuilder } from "./routeBuilder.js";

/**
 * Controller class for handling CRUD operations.
 */
export class CrudController {

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
    this.route = this.#_buildRouter();
  }

  /**
   * Handles the creation of a new entity.
   *
   * @param {Express.Request} req - The Express request object.
   * @param {Express.Response} res - The Express response object.
   * @param {Express.NextFunction} next - The Express next function.
   */
  async create(req, res, next) {
    try {
      const result = await this.service.create(req.body);
      success(res, result);
    }
    catch (e) {
      next(e);
    }
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
      const {sort} = req.query;
      const all = await this.service.findAll(sort);
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
      const { page, offset, sort } = req.query;

      // Check if page and offset query parameters are provided
      if (!page || !offset) {
        next(BadRequest("page and offset query parameters are required"));
        return;
      }

      // Retrieve and respond with paginated entities
      const result = await this.service.findAllPaginated(parseInt(page), parseInt(offset), sort);
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
   * Handles the update of an entity by ID.
   *
   * @param {Express.Request} req - The Express request object.
   * @param {Express.Response} res - The Express response object.
   * @param {Express.NextFunction} next - The Express next function.
   */
  async update(req, res, next) {
    try {

      // Check if request body is empty
      if (req.body === undefined || req.body === "" || Object.keys(req.body).length === 0) {
        next(BadRequest("Data to update cannot be empty!"))
        return;
      }

      const id = req.params.id;
      const result = await this.service.update(id, req.body);
      success(res, result);
    }
    catch (e) {
      next(e)
    }
  }

  /**
   * Handles the removal of an entity by ID.
   *
   * @param {Express.Request} req - The Express request object.
   * @param {Express.Response} res - The Express response object.
   * @param {Express.NextFunction} next - The Express next function.
   */
  async remove(req, res, next) {
    try {
      await this.service.remove(req.params.id);

      // Respond with 204 No Content for successful removal
      respond(res, 204);
    }
    catch (e) {
      next(e);
    }
  }

  /**
   * Builds and returns the Express Router with CRUD routes.
   *
   * @returns {Express.Router} The configured Express Router.
   * @private
   */
  #_buildRouter() {
    return new RouterBuilder()
      .register("get", '/', (...args) => this.findAllPaginated(...args))
      .register("get", '/get/all', (...args) => this.findAll(...args))
      .register("get", '/:id', (...args) => this.findById(...args))
      .register("post", '/', (...args) => this.create(...args))
      .register("put", '/:id', (...args) => this.update(...args))
      .register("delete", '/:id', (...args) => this.remove(...args))
      .build();
  }

}
