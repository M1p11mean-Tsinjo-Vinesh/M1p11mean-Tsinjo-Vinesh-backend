// Define the schema
import mongoose from "mongoose";
import dotenv from "dotenv";


// dot env support
dotenv.config();

const keys = [process.env.CLOUD_NAME, process.env.FILE_FOLDER];

export const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
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
      message: 'Vous devez ajouter au moins une image.'
    }
  },
  duration: {
    type: Number,
    required: true,
    min: 0 // Duration must be non-negative
  },
  price: {
    type: Number,
    required: true,
    min: 0 // Price must be positive
  },
  commission: {
    type: Number,
    required: true,
    min: 0,
    max: 1 // Commission must be between 0 and 1
  }
});

// Create a Mongoose model
export const ServiceModel = mongoose.model('Service', serviceSchema);

