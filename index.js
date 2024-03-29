// imports
import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import userRoute from "#routes/user.route.js";
import * as db from "./config/db.js";
import cors from "cors";
import {errorHandler} from "./app/middlewares/error-handler.js";
import {authenticateToken} from "./app/middlewares/auth.middleware.js";
import {crudEmployee, employeeAuthRouter} from "#routes/employee.route.js";
import UserType from "./app/data/constant/UserType.js";
import clientRoute from "#routes/client.route.js";
import * as storage from "./config/storage.js";
import {uploaderRouter} from "#routes/upload.router.js";
import {serviceCrudRoute} from "#routes/service.route.js";
import {
  appointmentClientRoute,
  appointmentCommonRoute,
  appointmentEmployeeRoute,
  appointmentManagerRoute,
} from "#routes/appointment.route.js";
import {crudOffer} from "#routes/offer.route.js";
import {paymentRoute} from "#routes/payment.route.js";
import {recapRoute} from "#routes/recap.route.js";
import {expenseRoute} from "#routes/expense.route.js";
import {preferencesRoute} from "#routes/preferences.route.js";
import {statRoute} from "#routes/stat.route.js";
import * as ws from "ws";
import {handleWsConnection} from "./app/ws/index.js";
import {notificationRoute} from "#routes/notification.route.js";

// dot env support
dotenv.config();
process.env.TZ = "Africa/Nairobi";
// server initialization
const app = express();
const wsServer = new ws.WebSocketServer({ noServer: true });

const PORT = process.env.PORT || 3000;

// load database
db.connect();

// setup storage
storage.setup();

app.use(
  cors({
    origin: [
      "http://localhost:4200",
      "http://192.168.88.2:4200",
      "https://m1p11mean-tsinjo-vinesh-back-office.vercel.app",
      "https://m1p11mean-tsinjo-vinesh-front-office.vercel.app",
    ],
  }),
);

// middlewares
// register middleware body Parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Use of the authentication middleware
app.use("/users", authenticateToken([UserType.CLIENT, UserType.EMPLOYEE]));
app.use("/clients/update-info", authenticateToken([UserType.CLIENT]));
app.use(
  "/employees-auth/update-info",
  authenticateToken([UserType.EMPLOYEE, UserType.MANAGER]),
);
app.use("/employees", authenticateToken([UserType.MANAGER], ["GET"]));
app.use("/services", authenticateToken([UserType.MANAGER], ["GET"]));
app.use("/upload", authenticateToken([UserType.MANAGER]));
app.use("/appointments", authenticateToken([UserType.CLIENT]));
app.use("/offers", authenticateToken([UserType.MANAGER]));
app.use("/manager/appointments", authenticateToken([UserType.MANAGER]));
app.use(
  "/employee/appointments",
  authenticateToken([UserType.EMPLOYEE, UserType.MANAGER]),
);
app.use(
  "/appointment-common",
  authenticateToken([UserType.CLIENT, UserType.MANAGER]),
);
app.use("/payment", authenticateToken([UserType.CLIENT, UserType.MANAGER]));
app.use("/recap", authenticateToken([UserType.EMPLOYEE, UserType.MANAGER]));
app.use("/expenses", authenticateToken([UserType.MANAGER]));
app.use(
  "/notifications",
  authenticateToken([UserType.MANAGER, UserType.EMPLOYEE, UserType.CLIENT]),
);

// register routes
app.use("/users", userRoute);
app.use("/clients", clientRoute);
app.use("/employees-auth", employeeAuthRouter);
app.use("/employees", crudEmployee);
app.use("/upload", uploaderRouter);
app.use("/services", serviceCrudRoute);
app.use("/appointments", appointmentClientRoute);
app.use("/manager/appointments", appointmentManagerRoute);
app.use("/offers", crudOffer);
app.use("/employee/appointments", appointmentEmployeeRoute);
app.use("/appointment-common", appointmentCommonRoute);
app.use("/payment", paymentRoute);
app.use("/recap", recapRoute);
app.use("/expenses", expenseRoute);
app.use("/preferences", preferencesRoute);
app.use("/stats", statRoute);
app.use("/notifications", notificationRoute);

// handle throws or next(err) by async calls
app.use(errorHandler);

// start listening to requests.
const httpServer = app.listen(PORT, (error) => {
  console.log(!error ? `Server is listening on port ${PORT}` : error);
});

wsServer.on("connection", handleWsConnection);

httpServer.on("upgrade", (request, socket, head) => {
  wsServer.handleUpgrade(request, socket, head, (socket) => {
    wsServer.emit("connection", socket, request);
  });
});
