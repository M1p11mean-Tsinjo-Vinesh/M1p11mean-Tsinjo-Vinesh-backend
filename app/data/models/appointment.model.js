// Define the schema
import mongoose from "mongoose";
import {serviceSchema} from "#models/service.model.js";

const appointmentSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  client: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    }
  },
  status: {
    type: Number,
    enum: [-10, 0, 10, 20],
    default: 0,
    required: true
  },
  comments: {
    type: [
      {
        author: {
          id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
          },
          name: {
            type: String,
            required: true
          },
          authorType: {
            type: String,
            enum: ["EMPLOYEE", "CLIENT"],
          }
        },
        text: {
          type: String,
          required: true
        },
        date: {
          type: Date,
          required: true
        }
      }
    ]
  }
});


const appointmentDetailsSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  client: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    }
  },
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  employee: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    }
  },
  service: {
    type: serviceSchema,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  }
});




// Create a Mongoose model
const AppointmentModel = mongoose.model('Appointment', appointmentSchema);
const AppointmentDetailsModel = mongoose.model('AppointmentDetail', appointmentDetailsSchema);

export {
  AppointmentModel,
  AppointmentDetailsModel
}