import {CrudController} from "#core/controllers/crud-controller.js";
import {RouteBuilder} from "#core/routeBuilder.js";

/**
 * Controller class for handling client-related operations, extending the CrudController.
 */
export class ClientController extends CrudController {

  /**
   * Middleware for handling client updates.
   *
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   * @param {function} next - Express next middleware function.
   * @returns {Promise} - A promise resolving the update operation via the parent class (CrudController).
   */
  async update(req, res, next) {
    // Set the params object to include the user's ID as the update target
    req.params = {
      id: req.user._id
    };

    // Delegate the update operation to the parent class (CrudController)
    return super.update(req, res, next);
  }

  /**
   * Build and configure routes for the ClientController.
   *
   * @returns {Object} - Configured routes for client-related operations.
   */
  buildRouter() {
    // Only update operation is available for now.
    return new RouteBuilder().
    register("put", "/update", this.update.bind(this));
  }

}
