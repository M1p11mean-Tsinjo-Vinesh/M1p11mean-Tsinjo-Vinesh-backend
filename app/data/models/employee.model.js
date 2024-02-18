import mongoose from "mongoose";

const schema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    default: "",
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },

  phone: {
    type: String,
  },
  employeeType: {
    type: String,
    enum: ["EMPLOYEE", "MANAGER"],
    required: true,
  },
  shifts: {
    type: Object,
  },
});

export const EmployeeModel = new mongoose.model("Employee", schema);
