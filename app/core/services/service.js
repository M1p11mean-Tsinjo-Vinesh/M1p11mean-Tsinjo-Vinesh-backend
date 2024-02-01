import { BadRequest } from "#core/util.js";

/**
 * Generic CRUD service class for MongoDB models.
 */
export class CrudService {

  // The MongoDB model for the CRUD operations
  Model;

  /**
   * Constructor for the CRUD service.
   *
   * @param {Model} model - The MongoDB model for the service.
   */
  constructor(model) {
    this.Model = model;
  }

  /**
   * Creates a new entity in the database.
   *
   * @param {Object} data - The data to create the entity.
   * @returns {Promise} A promise that resolves to the created entity.
   */
  async create(data) {
    const entity = new this.Model(data);
    return await entity.save();
  }

  /**
   * Finds all entities in the database.
   *
   * @returns {Promise} A promise that resolves to an array of all entities.
   */
  async findAll() {
    return await this.Model.find({});
  }

  /**
   * Finds entities in a paginated manner based on the provided page and offset.
   *
   * @param {number} page - The page number (starting from 1).
   * @param {number} offset - The number of elements per page.
   * @returns {Promise} A promise that resolves to an object with paginated results.
   */
  async findAllPaginated(page, offset) {
    if (page < 0) page = 1;
    const elements = await this.Model.find({})
      .limit(offset)
      .skip((page - 1) * offset)
      .sort({ createdAt: -1 });

    const count = await this.Model.countDocuments();
    return {
      elements,
      count,
      page,
      offset
    }
  }

  /**
   * Finds an entity by its ID.
   *
   * @param {string} id - The ID of the entity to find.
   * @returns {Promise} A promise that resolves to the found entity.
   */
  async findById(id) {
    return await this.Model.findById(id);
  }

  /**
   * Updates an entity by its ID with the provided data.
   *
   * @param {string} id - The ID of the entity to update.
   * @param {Object} data - The data to update the entity.
   * @returns {Promise} A promise that resolves to the updated entity.
   * @throws {BadRequest} Throws a BadRequest error if the entity is not found.
   */
  async update(id, data) {
    const updatedUser = await this.Model.findByIdAndUpdate(id, data, { new: true });
    if (!updatedUser) {
      throw BadRequest("Entity not found");
    }
    return updatedUser;
  }

  /**
   * Removes an entity by its ID.
   *
   * @param {string} id - The ID of the entity to remove.
   */
  async remove(id) {
    await this.Model.findByIdAndDelete(id);
  }

}
