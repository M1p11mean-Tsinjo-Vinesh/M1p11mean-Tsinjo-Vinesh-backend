import {CrudService} from "#core/services/crud-service.js";
import {BadRequest, hash} from "#core/util.js";

export class ClientService extends CrudService {

  async update(id, data) {
    const {confirmPassword, ...rest} = data;
    if (rest.password?.localeCompare(confirmPassword) !== 0) {
      throw BadRequest("Les mots de passe ne correspondent pas.");
    }
    const old = this.findById(id);
    if (old.password.localeCompare(hash(data.currentPassword)) !== 0) {
      throw BadRequest("Mot de passe actuel erroné!");
    }
    rest.password = hash(confirmPassword);
    return super.update(id, data);
  }

}