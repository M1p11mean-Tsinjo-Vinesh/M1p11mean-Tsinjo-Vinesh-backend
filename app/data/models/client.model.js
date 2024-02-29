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
  favoriteEmployees: {
    type: [mongoose.Schema.Types.ObjectId],
    default: []
  },
  favoriteServices: {
    type: [mongoose.Schema.Types.ObjectId],
    default: []
  },
});

export const ClientModel = new mongoose.model("Client", schema);
