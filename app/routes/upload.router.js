import express from "express";
import {imageUploader} from "../middlewares/multer.js";
import {fileUploader} from "../../config/storage.js";
import {BadRequest, success} from "#core/util.js";

const uploaderRouter = express.Router();

uploaderRouter.post(
  "/image",
  imageUploader.single("image"),
  async (req, res, next) => {
    try {
      if (req.file.size > (process.env.IMAGE_MAX_SIZE * 10**6)) {
        throw BadRequest("Taille maximum: 2Mo");
      }
      const result = await fileUploader.upload(req.file.path);
      success(res, {
        url: result.secure_url
      })
    }
    catch (e) {
      next(e);
    }
  }
);

export {uploaderRouter}