import { BadRequest, respond, success } from "#core/util.js";
import {ReadController} from "#core/controllers/read-controller.js";

/**
 * Controller class for handling CRUD operations.
 */
export class CrudController extends ReadController {

  constructor(service) {
    super(service);
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

  buildRouter() {
    return super.buildRouter()
      .register("post", '/', (...args) => this.create(...args))
      .register("put", '/:id', (...args) => this.update(...args))
      .register("delete", '/:id', (...args) => this.remove(...args));
  }

}
