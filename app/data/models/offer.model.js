import mongoose from "mongoose";
import { ServiceModel } from "#models/service.model.js";

const keys = [process.env.CLOUD_NAME, process.env.FILE_FOLDER];

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
    validator: {
      validator: (date) => {
        return date > new Date();
      },
      message: "La date de début doit être postérieure à la date actuelle.",
    },
  },
  endDate: {
    type: Date,
    required: true,
    validator: {
      validator: (date) => {
        return date > this.startDate;
      },
      message: "La date de fin doit être postérieure à la date de début.",
    },
  },
  pictureUrls: {
    type: [String],
    required: true,
    validate: {
      validator: (array) => {
        if (array) {
          for (let url of array) {
            if (!url.startsWith("https://res.cloudinary.com/")) return false;
            for (let match of keys) {
              if (!url.includes(match)) return false;
            }
          }
          return true;
        }
        return false;
      }, // At least one picture required
      message: "Vous devez ajouter au moins une image.",
    },
  },
  services: {
    type: Array,
    required: true,
    validator: {
      validator: (array) => {
        if (array) {
          for (let service of array) {
            if (!ServiceModel.findById(service._id)) return false;
          }
          return true;
        }
        return false;
      },
      message: "Vous devez ajouter au moins un service.",
    },
  },
});

export const OfferModel = mongoose.model("Offer", schema);
