
export class ReadService {
  // The MongoDB model for the CRUD operations
  Model;

  constructor(model) {
    this.Model = model;
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
  async findAllPaginated(page = 1, offset = 10, sort = {}) {
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
      pageSize: offset
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


}