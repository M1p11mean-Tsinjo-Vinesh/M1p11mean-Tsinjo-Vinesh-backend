import mongoose from "mongoose";

// Set the global Promise to the native Promise implementation in Node.js
mongoose.Promise = global.Promise;

/**
 * Callback function for database connection error.
 *
 * @param {Errors} err - The error object from the database connection.
 */
function onDbConnectError(err) {
  console.log('Could not connect to the database', err);
  process.exit();
}

/**
 * Callback function for successful database connection.
 */
function onDbConnectSuccess() {
  console.log("Database Connected Successfully!!");
}

/**
 * Function to establish a connection to the MongoDB database.
 */
export function connect() {
  // Connect to the MongoDB database using the provided URL
  mongoose.connect(process.env.MONGO_URL)
    .then(onDbConnectSuccess)
    .catch(onDbConnectError);
}
