import multer from "multer";
import path from "path";
import {BadRequest} from "#core/util.js";

export const imageUploader = multer({
  storage: multer.diskStorage({
    getFilename: (req) => req.file.originalname
  }),
  fileFilter: (req, file, next) => {
    let ext = path.extname(file.originalname);
    if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
      next(BadRequest("Veuillez insérer un image"), false);
      return;
    }
    next(null, true);
  }
});