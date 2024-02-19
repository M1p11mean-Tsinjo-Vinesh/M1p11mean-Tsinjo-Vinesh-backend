import { BadRequest, hash } from "#core/util.js";
import jwt from "jsonwebtoken";
import { validateEmail, validatePhone } from "../../common/validators.js";
import Errors from "../../common/Errors.js";
import { ClientModel } from "#models/client.model.js";
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
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          role: user.employeeType
            ? this.roleMapping[user.employeeType]
            : this.roleMapping[this.Modal],
          shifts: user.shifts ? user.shifts : [],
          favoriteEmployees: user.favoriteEmployees
            ? user.favoriteEmployees
            : [],
          favoriteServices: user.favoriteServices ? user.favoriteServices : [],
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
          _id: user._id,
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
   * Update method to update a user's information.
   *
   * @param {string} id - The unique identifier of the user.
   * @param {Object} data - The data to be updated, including confirmPassword for password confirmation.
   * @returns {Promise<Object>} - A promise that resolves to the updated data without the password field.
   * @throws {BadRequest} - If password and confirmPassword do not match, or if the currentPassword is incorrect.
   */
  async update(id, data) {
    // Destructure the data object, separating confirmPassword from the rest
    const { confirmPassword, ...rest } = data;

    // Check if the provided password and confirmPassword match
    if (
      rest.password !== undefined &&
      rest.password?.localeCompare(confirmPassword) !== 0
    ) {
      throw BadRequest("Les mots de passe ne correspondent pas.");
    }

    // Retrieve the existing data from the database based on the provided ID
    const old = await this.Modal.findById(id);
    if (!old) {
      throw BadRequest("Entity not found");
    }

    // Check if the hashed currentPassword matches the existing hashed password
    if (
      data.currentPassword !== undefined &&
      old.password.localeCompare(hash(data.currentPassword)) !== 0
    ) {
      throw BadRequest("Mot de passe actuel erroné!");
    }
    if (confirmPassword !== undefined) {
      rest.password = hash(confirmPassword);
    }
    // Hash the confirmPassword and update the rest of the data

    // Call the update method from the parent class (CrudService)
    const updatedUser = await this.Modal.findByIdAndUpdate(id, rest, {
      new: true,
    });

    const { password, ...updateData } = updatedUser._doc;
    // Return the updated data without the password field
    return updateData;
  }
}
