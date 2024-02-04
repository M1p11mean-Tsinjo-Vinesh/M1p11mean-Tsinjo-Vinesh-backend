import { ClientModel } from "#models/client.model.js";

export class ClientService {
  Modal;

  constructor() {
    this.Modal = ClientModel;
  }

  async checkMail(email) {
    return !!!(await this.Modal.findOne({ email: email }));
  }
}
