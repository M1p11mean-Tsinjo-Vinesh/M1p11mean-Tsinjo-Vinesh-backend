import { BadRequest } from "#core/util.js";
import {ReadService} from "#core/services/read-service.js";


export class CrudService extends ReadService {

  constructor(Model, ignoredFields) {
    super(Model, ignoredFields);
  }

  clean(data) {
    this.ignoredFields.forEach(key => delete data[key]);
    return data;
  }

  /**
   * Creates a new entity.
   *
   * @param {Object} data - The data for the new entity.
   * @returns {Promise} A promise that resolves to the created entity.
   */
  async create(data) {
    const entity = new this.Model(data);
    const created = await entity.save();
    return this.clean(created._doc);
  }

  /**
   * Updates an entity by ID with the provided data.
   *
   * @param {string} id - The ID of the entity to update.
   * @param {Object} data - The data to update the entity with.
   * @returns {Promise} A promise that resolves to the updated entity.
   */
  async update(id, data) {
    const updatedUser = await this.Model.findByIdAndUpdate(id, data, { new: true });
    if (!updatedUser) {
      throw BadRequest("Entity not found");
    }
    return this.clean(updatedUser._doc);
  }

  /**
   * Removes an entity by ID.
   *
   * @param {string} id - The ID of the entity to remove.
   */
  async remove(id) {
    await this.Model.findByIdAndDelete(id);
  }

}
