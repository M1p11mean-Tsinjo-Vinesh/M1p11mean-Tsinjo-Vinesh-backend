import {CrudService} from "#core/services/crud-service.js";
import {hash} from "#core/util.js";

export class EmployeeService extends CrudService {

  async create(data) {
    // by default the employee password is 1234.
    data.password = hash("1234");
    return await super.create(data);
  }

}