// imports
import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import userRoute from "#routes/user.route.js";
import * as db from "./config/db.js";
import cors from "cors";
import {errorHandler} from "./app/middlewares/error-handler.js";
import {queryObjectParser} from "./app/middlewares/query-object-parser.js";
import {authenticateToken} from "./app/middlewares/auth.middleware.js";
import {crudEmployee, employeeAuthRouter} from "#routes/employee.route.js";
import UserType from "./app/data/constant/UserType.js";
import clientRoute from "#routes/client.route.js";
import * as storage from "./config/storage.js";
import {uploaderRouter} from "#routes/upload.router.js";
import {serviceCrudRoute} from "#routes/service.route.js";

// dot env support
dotenv.config();

// server initialization
const app = express();
const PORT = process.env.PORT || 3000;

// load database
db.connect();

// setup storage
storage.setup();

// middlewares
// register middleware body Parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(queryObjectParser);

// Use of the authentication middleware
app.use("/users", authenticateToken([UserType.CLIENT, UserType.EMPLOYEE]));
app.use("/clients/update-info", authenticateToken([UserType.CLIENT]));
app.use("/employees-auth/update-info", authenticateToken([UserType.EMPLOYEE, UserType.MANAGER]));
app.use("/employees", authenticateToken([UserType.MANAGER]));
app.use("/services", authenticateToken([UserType.MANAGER]));

app.use(
  cors({
    origin: "http://localhost:4200",
  }),
);

// register routes
app.use("/users", userRoute);
app.use("/clients", clientRoute);
app.use("/employees-auth", employeeAuthRouter);
app.use("/employees", crudEmployee);
app.use("/upload", uploaderRouter);
app.use("/services", serviceCrudRoute);

// handle throws or next(err) by async calls
app.use(errorHandler);

// start listening to requests.
app.listen(PORT, (error) => {
  console.log(!error ? `Server is listening on port ${PORT}` : error);
});
