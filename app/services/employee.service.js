import {CrudService} from "#core/services/crud-service.js";
import {hash} from "#core/util.js";
import {AuthService} from "#core/services/auth.service.js";

export class EmployeeService extends CrudService {


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