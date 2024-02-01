/**
 * Utility function to handle response formatting.
 *
 * @param {Express.Response} res - The Express response object.
 * @param {number} statusCode - The HTTP status code.
 * @param {Object} body - The response body.
 * @param {Function} fn - The response function (default is res.json).
 */
export const respond = (res, statusCode, body = {}, fn = res.json) => {
  res.status(statusCode);

  // If body is empty, send an empty response
  if (Object.keys(body).length === 0) res.send();

  // Call the response function with formatted body
  fn.call(res, {
    data: body
  });
}

/**
 * Utility function to handle success response (HTTP status code 200).
 *
 * @param {Express.Response} res - The Express response object.
 * @param {Object} body - The response body.
 * @param {Function} fn - The response function (default is res.json).
 */
export const success = (res, body = {}, fn = res.json) => respond(res, 200, body, fn);

/**
 * CustomError factory function to create custom error objects.
 *
 * @param {number} code - The error code.
 * @param {string} message - The error message.
 * @returns {Error} The custom error object.
 */
export const CustomError = (code, message) => {
  const error = new Error(message);
  error.code = code;
  return error;
}

/**
 * BadRequest factory function to create a 400 Bad Request error.
 *
 * @param {string} message - The error message.
 * @returns {Error} The BadRequest error object.
 */
export const BadRequest = (message) => CustomError(400, message);