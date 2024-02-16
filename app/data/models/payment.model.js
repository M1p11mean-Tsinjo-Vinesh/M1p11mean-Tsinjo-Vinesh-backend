import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  appointmentId: {
    type: mongoose.Types.ObjectId,
    required: true,
    unique: true
  },
  paid: {
    type: Number,
    required: true,
    validate: {
      validator: value => value > 0,
      message: "Veuillez entrer un prix positive"
    }
  },
  paymentInfo: {
    type: {
      phoneNumber: {
        type: String,
        required: true
      }
    },
    required: true
  }
});

export const PaymentModel = new mongoose.model('Payment', paymentSchema);