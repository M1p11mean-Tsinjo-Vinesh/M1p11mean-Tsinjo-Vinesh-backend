import {CrudService} from "#core/services/crud-service.js";
import {hash} from "#core/util.js";
import {AuthService} from "#core/services/auth.service.js";
import {EmployeeModel} from "#models/employee.model.js";

export class EmployeeService extends CrudService {

  constructor() {
    super(EmployeeModel, ["password"]);
  }


  // 1234 default password for every user
  async create(data) {
    // by default the employee password is 1234.
    data.password = hash("1234");
    return await super.create(data);
  }

}

export class EmployeeAuthService extends AuthService {

  // employeeType should not be updated
  async update(id, {employeeType, ...data}) {
    return super.update(id, data);
  }

}