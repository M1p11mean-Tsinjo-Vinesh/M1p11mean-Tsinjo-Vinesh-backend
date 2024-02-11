
// this class will be used to build filter option for a mongoose model
export class FilterOptionsBuilder {

  allowedParams;
  query;

  // contains all the possible operator for filtering
  operatorMap = {
    gte: (fieldName, value) => ({ [fieldName]: { $gte: value } }),
    lte: (fieldName, value) => ({ [fieldName]: { $lte: value } }),
    gt: (fieldName, value) => ({ [fieldName]: { $gt: value } }),
    lt: (fieldName, value) => ({ [fieldName]: { $lt: value } }),
    eq: (fieldName, value) => ({ [fieldName]: value }),
    ilike: (fieldName, value) => ({ [fieldName]: { $regex: `/${value}/i` } }),
    like: (fieldName, value) => ({ [fieldName]: { $regex: `/${value}/` } }),
  };

  // the query from the request
  constructor(query) {
    this.query = query;
  }

  build() {
    if(!this.allowedParams) return {};
    const filterOptions = {};
    const filterObject = this.getParamValues();
    for (const key in filterObject) {
      if (filterObject.hasOwnProperty(key)) {
        const [operator, fieldName] = key.split(':');
        const value = filterObject[key];
        const operatorFunction = this.operatorMap[operator];
        if (!operatorFunction) continue;
        Object.assign(filterOptions, operatorFunction(fieldName, value));
      }
    }
    return filterOptions;
  }

  getParamValues() {
    const params = {}
    for(let key of Object.keys(this.query)) {
      if (this.IsKeyValid(key)) {
        params[key] = this.query[key];
      }
    }
    return params;
  }


  // key should contain ":" and one of the allowed param key.
  IsKeyValid(key) {
    if(!key.includes(":")) return false;
    for(let allowed of this.allowedParams) {
      if(key.includes(allowed)) return true;
    }
    return false;
  }

  // list is an array of the param in which we are allowed to filter
  // eg: if list is ["name", "age"]
  // the builder will only build filter options for these keys
  setAllowedParams(allowedParams) {
    this.allowedParams = allowedParams;
    return this;
  }

}