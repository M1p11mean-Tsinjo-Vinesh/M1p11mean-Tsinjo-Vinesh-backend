import { BadRequest } from "#core/util.js";
import Errors from "./Errors.js";

export function validateEmail(email) {
  const re = /\S+@\S+\.\S+/;

  if (!email) throw BadRequest(Errors.EMPTY_EMAIL.message);
  if (!re.test(email)) throw BadRequest(Errors.INVALID_EMAIL.message);
}

/**
 * Validate phone number which must be in the following formats
 * 1. 10 numbers without any special characters and begin with 0
 * 2. 12 numbers beginning with +261 and followed by 9 numbers
 */
export function validatePhone(phone) {
  const re = /^(0|(\+261))\d{9}$/;

  if (!phone) throw BadRequest(Errors.EMPTY_PHONE.message);
  // remove spaces
  phone = phone.replace(/\s/g, "");
  if (!re.test(phone)) throw BadRequest(Errors.INVALID_PHONE.message);
}
