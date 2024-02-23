import {CrudService} from "#core/services/crud-service.js";
import {hash} from "#core/util.js";
import {AuthService} from "#core/services/auth.service.js";
import {EmployeeModel} from "#models/employee.model.js";

export class EmployeeService extends CrudService {

  constructor() {
    super(EmployeeModel, ["password"]);
  }

  async findManagers(cols = "email") {
    return await EmployeeModel.find({
      employeeType: "MANAGER"
    }, 'email');
  }


  // 1234 default password for every user
  async create(data) {
    // by default, the employee password is 1234.
    data.password = hash("1234");
    const workDays = [1,2,3,4,5];
    // default shift for every employee
    data.shifts = [
      {
        daysOfWeek: workDays,
        startTime: "08:00",
        endTime: "12:00"
      },
      {
        daysOfWeek: workDays,
        startTime: "13:00",
        endTime: "17:00"
      }
    ];
    return await super.create(data);
  }

}

export class EmployeeAuthService extends AuthService {

  // employeeType should not be updated
  async update(id, {employeeType, ...data}) {
    return super.update(id, data);
  }

}