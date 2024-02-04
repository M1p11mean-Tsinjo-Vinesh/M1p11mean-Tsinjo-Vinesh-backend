import {v2 as cloudinary} from "cloudinary";
const {config, uploader} = cloudinary;

let isSet;
let folder;
let fileUploader;

function setup () {
  if (isSet) return;

  config({
    cloud_name:process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret:process.env.CLOUDINARY_SECRET
  });

  folder = process.env.FILE_FOLDER;

  isSet = true;
  fileUploader = {
    upload:  async fileName => await uploader.upload(fileName, {
      folder
    })
  }
  console.log("Cloud storage setup successfully !");
}


export {setup, cloudinary, fileUploader};