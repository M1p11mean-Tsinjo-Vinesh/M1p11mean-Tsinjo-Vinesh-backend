import express from "express";

/**
 * Class for building routes using Express Router.
 */
export class RouteBuilder {
  // List to store route configurations [method, url, pathHandler]
  list = [];
  // Express Router instance
  router;

  /**
   * Constructor for the RouteBuilder class.
   */
  constructor() {
    this.router = express.Router();
  }

  /**
   * Registers a route with the specified method, url, and pathHandler.
   *
   * @param {string} method - The HTTP method for the route (e.g., "get", "post").
   * @param {string} url - The URL pattern for the route.
   * @param {Function} pathHandler - The handler function for the route.
   * @returns {RouteBuilder} The current RouteBuilder instance for method chaining.
   */
  register(method, url, pathHandler) {
    this.list.push([method, url, pathHandler]);
    return this;
  }

  /**
   * Builds and returns the Express Router with registered routes.
   *
   * @returns {Router} The configured Express Router.
   */
  build() {
    for (const [method, url, pathHandler] of this.list) {
      // Wrap pathHandler with the middleware before registering
      this.router[method](url, pathHandler);
    }
    return this.router;
  }
}
