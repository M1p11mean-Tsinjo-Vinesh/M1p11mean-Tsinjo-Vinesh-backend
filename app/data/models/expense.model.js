import mongoose from "mongoose";

const schema = new mongoose.Schema({
  timeKey: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  month: {
    type: Number,
    required: true,
    validate: {
      validator: value => value >= 0 && value <= 11,
      message: "Mois invalide"
    }
  },
  type: {
    type: String,
    enum: ["SALARY", "RENT", "BUYING", "OTHER"],
    required: true
  },
  amount: {
    type: Number,
    required: true,
    validate: {
      validator: value => value > 0,
      message: "Valeur invalide"
    }
  },
  description: String
});

export const ExpenseModel = new mongoose.model('Expense', schema);