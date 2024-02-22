// dot env support
import dotenv from "dotenv";

dotenv.config();

export const FRONT_URL = process.env.FRONT_URL;

export const getAdminAppointmentUrl = (appointment) => FRONT_URL + "appointment/" + appointment._id;
export const VALIDATION_ICON  = "https://res.cloudinary.com/dje2mveih/image/upload/v1708613830/m1p11mean-Tsinjo-Vinesh/wa4n1j6c11knectwzlaw.png";