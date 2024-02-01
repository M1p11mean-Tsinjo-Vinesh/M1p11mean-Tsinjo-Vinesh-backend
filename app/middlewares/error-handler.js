export const errorHandler = (err, req, res, next) => {
  // Format body on error
  const {code ,statusCode, message} = err;

  // we can add condition to change mongoDb error by code

  // Construct error body
  const errorBody = {
    statusCode: statusCode || 500,
    message: message
  };

  console.error(err);

  // Respond with formatted error JSON
  res.status(errorBody.statusCode).json({ error: errorBody });
}
