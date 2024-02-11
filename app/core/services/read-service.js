
export class ReadService {
  // The MongoDB model for the CRUD operations
  Model;
  ignoredFields = [];
  projection;

  constructor(model, ignoredFields = []) {
    this.Model = model;
    this.ignoredFields = ignoredFields;
    this.buildProjection();
  }

  buildProjection() {
    this.projection = {}
    this.ignoredFields.forEach( key => this.projection[key] = 0);
  }

  async findAll({sort, search} = {
    sort: {},
    search: {}
  }) {
    let query = this.Model.find(search, this.projection);
    return await this.sortQuery(query, sort);
  }

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

  async findAllPaginated(page = 1, offset = 10, {sort, search} = {
    sort: {},
    search: {}
  }) {
    if (page < 0) page = 1;
    const query = this.Model.find(search, this.projection)
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

  async findOne(search) {
    return await this.Model.findOne(search, this.projection);
  }


}