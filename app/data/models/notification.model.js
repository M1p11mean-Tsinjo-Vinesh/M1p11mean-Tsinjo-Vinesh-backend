import mongoose from "mongoose";

const schema = new mongoose.Schema({
  pictureUrl: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  redirectUrl: String,
  date: {
    type: Date,
    required: true
  },
  userId: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  seen: {
    type: Boolean,
    default: false
  }
});

export const NotificationModel = new mongoose.model('Notification', schema);