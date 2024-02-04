import {BadRequest, success} from "#core/util.js";
import {RouteBuilder as RouterBuilder} from "#core/routeBuilder.js";

export class AuthController {
  // The service responsible for Authentication operations
  service;

  // Express Router for CRUD routes
  route;

  constructor(AuthService) {
    this.service = AuthService;
    this.route = this.buildRouter().build();
  }

  /**
   * Handles the login of a user.
   *
   * @param {Express.Request} req - The Express request object.
   * @param {Express.Response} res - The Express response object.
   * @param {Express.NextFunction} next - The Express next function.
   */
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await this.service.login(email, password);
      success(res, result);
    } catch (e) {
      next(e);
    }
  }

  /**
   * Handles the registration of a new user.
   *
   * @param {Express.Request} req - The Express request object.
   * @param {Express.Response} res - The Express response object.
   * @param {Express.NextFunction} next - The Express next function.
   */
  async register(req, res, next) {
    try {
      const result = await this.service.register(req.body);
      success(res, result);
    } catch (e) {
      next(e);
    }
  }

  async update(req, res, next) {
    try {

      // Check if request body is empty
      if (req.body === undefined || req.body === "" || Object.keys(req.body).length === 0) {
        next(BadRequest("Data to update cannot be empty!"))
        return;
      }

      const id = req.user._id;
      const result = await this.service.update(id, req.body);
      success(res, result);
    }
    catch (e) {
      next(e)
    }
  }

  buildRouter() {
    return new RouterBuilder()
      .register("post", "/login", this.login.bind(this))
      .register("post", "/register", this.register.bind(this))
      .register("put", "/update-info", this.update.bind(this));
  }
}
