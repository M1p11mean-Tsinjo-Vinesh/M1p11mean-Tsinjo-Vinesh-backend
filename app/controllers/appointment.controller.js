import {RouteBuilder} from "#core/routeBuilder.js";
import {AppointmentService} from "#services/appointment.service.js";
import {respond, success} from "#core/util.js";

export class AppointmentController {

  route;
  service;

  constructor() {
    this.service = new AppointmentService();
    this.route = this.buildRouter().build();
  }


  async addComment(req, res, next) {
    const {text} = req.body;
    const {firstName, lastName} = req.user;
    const author = {
      _id: req.user._id,
      name: `${firstName} ${lastName}`,
      authorType: req.user.role
    }
    try {
      const appointment = await this.service.addComment(req.params.id, {
        text,
        author,
        date: new Date()
      })
      success(res, appointment);
    }
    catch (e) {
      next(e);
    }
  }


  buildRouter() {
    return new RouteBuilder()
      .register("put", "/:id/comments", this.addComment.bind(this));
  }
}