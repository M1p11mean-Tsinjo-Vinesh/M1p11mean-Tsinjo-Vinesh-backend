import { CrudService } from "#core/services/crud-service.js";
import { BadRequest, hash } from "#core/util.js";

/**
 * Service class for managing client entities, extending the CrudService.
 */
export class ClientService extends CrudService {

  /**
   * Update method to update a client's information.
   *
   * @param {string} id - The unique identifier of the client.
   * @param {Object} data - The data to be updated, including confirmPassword for password confirmation.
   * @returns {Promise<Object>} - A promise that resolves to the updated data without the password field.
   * @throws {BadRequest} - If password and confirmPassword do not match, or if the currentPassword is incorrect.
   */
  async update(id, data) {
    // Destructure the data object, separating confirmPassword from the rest
    const { confirmPassword, ...rest } = data;

    // Check if the provided password and confirmPassword match
    if (rest.password?.localeCompare(confirmPassword) !== 0) {
      throw BadRequest("Les mots de passe ne correspondent pas.");
    }

    // Retrieve the existing data from the database based on the provided ID
    const old = await this.findById(id);

    // Check if the hashed currentPassword matches the existing hashed password
    if (old.password.localeCompare(hash(data.currentPassword)) !== 0) {
      throw BadRequest("Mot de passe actuel erroné!");
    }

    // Hash the confirmPassword and update the rest of the data
    rest.password = hash(confirmPassword);

    // Call the update method from the parent class (CrudService)
    const { password, ...updateData } = (await super.update(id, rest))._doc;

    // Return the updated data without the password field
    return updateData;
  }
}
