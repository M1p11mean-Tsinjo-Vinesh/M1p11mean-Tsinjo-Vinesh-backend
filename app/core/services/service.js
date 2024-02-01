import { BadRequest } from "#core/util.js";

export class CrudService {

  // The MongoDB model for the CRUD operations
  Model;

  constructor(model) {
    this.Model = model;
  }

  /**
   * Creates a new entity.
   *
   * @param {Object} data - The data for the new entity.
   * @returns {Promise} A promise that resolves to the created entity.
   */
  async create(data) {
    const entity = new this.Model(data);
    return await entity.save();
  }

  /**
   * Retrieves all entities with optional sorting.
   *
   * @param {Object} sort - The sorting options.
   * @returns {Promise} A promise that resolves to the array of entities.
   */
  async findAll(sort = {}) {
    let query = this.Model.find({});
    return await this.sortQuery(query, sort);
  }

  /**
   * Sorts the given query based on the provided sorting options.
   *
   * @param {Object} query - The MongoDB query.
   * @param {Object} sort - The sorting options.
   * @returns {Object} The sorted MongoDB query.
   * @private
   */
  sortQuery(query, sort) {
    const { column, method } = sort;
    if (column && method) {
      const sortData = {
        [column]: parseInt(method)
      };
      query = query.sort(sortData);
    }
    return query;
  }

  /**
   * Retrieves paginated entities with optional sorting.
   *
   * @param {number} page - The page number.
   * @param {number} offset - The number of items per page.
   * @param {Object} sort - The sorting options.
   * @returns {Promise} A promise that resolves to the paginated result.
   */
  async findAllPaginated(page, offset, sort = {}) {
    if (page < 0) page = 1;
    const query = this.Model.find({})
      .limit(offset)
      .skip((page - 1) * offset)
      .sort({ createdAt: -1 });

    const elements = await this.sortQuery(query, sort);
    const count = await this.Model.countDocuments();
    return {
      elements,
      count,
      page,
      offset
    };
  }

  /**
   * Retrieves an entity by ID.
   *
   * @param {string} id - The ID of the entity to retrieve.
   * @returns {Promise} A promise that resolves to the retrieved entity.
   */
  async findById(id) {
    return await this.Model.findById(id);
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
    return updatedUser;
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
