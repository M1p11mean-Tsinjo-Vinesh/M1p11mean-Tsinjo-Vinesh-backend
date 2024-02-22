import {NotificationSender} from "#services/notification/notification.sender.js";
import {mailer} from "#core/services/mailer.js";

/**
 * Send notification with email
 */
export class NotificationEmailSender extends NotificationSender {

  notificationSender;

  /**
   * Decorator pattern for notification Sender
   * @param notificationSender
   */
  constructor(notificationSender = undefined) {
    super();
    this.notificationSender = notificationSender;
  }

  /**
   * Sends notification with email.
   * @param data
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
    mailer.send({
      dates: [new Date()],
      recipients: [email],
      subject: `[Notification-M1-Tsinjo-Vinesh] ${title}`,
      content: `
        Bonjour,
      
        Ceci est un mail de notification, <br> 
        Description : ${description}, <br>
        Pour en savoir plus, veuillez cliquer <a href="${redirectUrl}">ici</a>
        
        Merci de votre confiance, <br>
        
        Nos remerciements,
        Beauty salon, M1 Tsinjo Vinesh
      `
    });
    if(this.notificationSender) this.notificationSender.send(data);
  }
}