// dot env support
import dotenv from "dotenv";

dotenv.config();

export const BO_URL = process.env.BO_URL;
export const FO_URL = process.env.FO_URL;

export const getAdminAppointmentUrl = (appointment) =>
  BO_URL + "/management/rendez-vous/details/" + appointment._id;
export const getClientAppointmentUrl = (appointment) =>
  FO_URL + "rendez-vous/details/" + appointment._id;
export const VALIDATION_ICON =
  "https://res.cloudinary.com/dje2mveih/image/upload/v1708613830/m1p11mean-Tsinjo-Vinesh/wa4n1j6c11knectwzlaw.png";
export const CANCEL_ICON =
  "https://res.cloudinary.com/dje2mveih/image/upload/v1708679693/m1p11mean-Tsinjo-Vinesh/rb0a2umebsrrh6tqvgjc.png";
export const PAID_ICON =
  "https://res.cloudinary.com/dje2mveih/image/upload/v1708679660/m1p11mean-Tsinjo-Vinesh/p9nbl3hbt6xbovw9xsc4.jpg";

export const SPECIAL_OFFER_ICON = "https://res.cloudinary.com/dje2mveih/image/upload/v1709190131/assets/special-offer-creative-sale-banner-design_1017-16284.jpg_ycsbkv.avif";
