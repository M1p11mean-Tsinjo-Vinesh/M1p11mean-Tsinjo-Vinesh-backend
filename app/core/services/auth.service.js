import {BadRequest, hash} from "#core/util.js";
import jwt from "jsonwebtoken";
import {validateEmail, validatePhone} from "../../common/validators.js";
import Errors from "../../common/Errors.js";
import {ClientModel} from "#models/client.model.js";
import UserType from "../../data/constant/UserType.js";

export class AuthService {
  Modal;

  roleMapping = {
    [ClientModel]: UserType.CLIENT,
    EMPLOYEE: UserType.EMPLOYEE,
    MANAGER: UserType.MANAGER,
  };

  constructor(Model) {
    this.Modal = Model;
  }

  /**
   * Handles the login of a user.
   *
   * @param {string} email - The email of the user.
   * @param {string} password - The password of the user.
   * @returns {Promise} A promise that resolves to the user and token.
   */
  async login(email, password) {
    const hashedPassword = hash(password);
    const user = await this.Modal.findOne({ email, password: hashedPassword });
    if (!user) {
      throw BadRequest(Errors.LOGIN_INVALID_CREDENTIALS.message);
    }
    return {
      jwt: jwt.sign(
        {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          role: user.employeeType
            ? this.roleMapping[user.employeeType]
            : this.roleMapping[this.Modal],
        },
        process.env.TOKEN_SECRET,
        {
          expiresIn: "1h",
        },
      ),
    };
  }

  /**
   * Handles the registration of a new user.
   *
   * @param {Object} data - The data for the new user.
   * @returns {Promise} A promise that resolves to the created user.
   */
  async register(data) {
    validateEmail(data.email);
    validatePhone(data.phone);
    const hashedPassword = hash(data.password);
    const user = new this.Modal({ ...data, password: hashedPassword });
    await user.save();
    return {
      jwt: jwt.sign(
        {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
        },
        process.env.TOKEN_SECRET,
        {
          expiresIn: "1h",
        },
      ),
    };
  }
}
