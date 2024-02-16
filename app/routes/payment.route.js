import {PaymentController} from "#controllers/payment.controller.js";
import {appointmentService} from "#routes/appointment.route.js";


const paymentController = new PaymentController(appointmentService);
export const paymentRoute = paymentController.route;