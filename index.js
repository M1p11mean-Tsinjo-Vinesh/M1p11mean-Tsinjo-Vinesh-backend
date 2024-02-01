// imports
import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import userRoute from "#routes/user-route.js";
import * as db from "./db.js";
import {errorHandler} from "./app/middlewares/error-handler.js";

// dot env support
dotenv.config();


// server initialization
const app = express();
const PORT = process.env.PORT || 3000;

// load database
db.connect();


// middlewares
// register middleware body Parser
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// register routes
app.use("/users", userRoute);

// handle throws or next(err) by async calls
app.use(errorHandler)

// start listening to requests.
app.listen(PORT, (error) => {
  console.log(!error ? `Server is listening on port ${PORT}` : error);
});