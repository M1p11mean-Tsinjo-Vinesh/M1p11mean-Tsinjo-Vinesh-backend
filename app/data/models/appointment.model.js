// Define the schema
import mongoose from "mongoose";
import {serviceSchema} from "#models/service.model.js";

const appointmentSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  appointmentDate: {
    type: Date,
    required: true
  },
  client: {
    type:  {
      _id: {
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
    required: true
  },
  status: {
    type: Number,
    /**
     * -10 -> CANCELED,
     * 0 -> CREATED,
     * 10 -> VALIDATED
     * 20 -> PAID
     */
    enum: [-10, 0, 10, 20],
    default: 0,
    required: true
  },
  comments: [
    {
      author: {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          required: true
        },
        name: {
          type: String,
          required: true
        },
        authorType: {
          type: String,
          enum: ["EMPLOYEE", "CLIENT", "MANAGER"],
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
});


const appointmentDetailsSchema = new mongoose.Schema({
  client: {
    type: {
      _id: {
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
    required: true
  },
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  employee: {
    type: {
      _id: {
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
    required: true
  },
  service: {
    type: serviceSchema,
    required: true
  },
  status: {
    type: Number,
    /**
     * -10 -> CANCELED,
     * 0 -> CREATED
     * 10 -> VALIDATED
     * 30 -> DONE
     */
    enum: [-10, 0, 10, 30],
    default: 0,
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