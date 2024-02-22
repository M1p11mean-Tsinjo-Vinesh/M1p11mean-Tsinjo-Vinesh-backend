/**
 * Base class for notification sender
 */
export class NotificationSender {

  /**
   * Send notification
   * @param data
   * {
   *   user: {
   *     _id,
   *     email
   *   },
   *   title,
   *   description,
   *   redirectUrl,
   *   pictureUrl
   * }
   */
  send(data) {
    const {
      user: {
        _id,
        email
      },
      title,
      description,
      redirectUrl,
      pictureUrl
    } = data;
  }


}