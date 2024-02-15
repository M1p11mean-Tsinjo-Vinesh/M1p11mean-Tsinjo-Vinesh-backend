import dotenv from "dotenv";
import axios from "axios";

// dot env support
dotenv.config();

export class Mailer {

  SENDER = process.env.MAIL_SENDER;
  API_KEY = process.env.MAIL_API_KEY;
  URL = process.env.MAIL_API_URL;
  requestConfig;

  constructor() {
    this.requestConfig = {
      headers: {
        "X-ElasticEmail-ApiKey": this.API_KEY
      }
    }
  }

  async send({
    dates, // list of dates to send the email
    ...rest
  }) {
    const promises = [];
    for (let date of dates) {
      let delay = new Date(date).getTime() - new Date().getTime();
      delay = delay < 0 ? 0 : delay / 60000;
      const sent = axios.post(
        this.URL,
        this.createApiBody({delay, ...rest}),
        this.requestConfig
      )
      promises.push(sent);
    }
    return await Promise.all(promises);
  }


  createApiBody({
      recipients, // string[],
      subject,
      contentType = "HTML", // HTML or Plain Text of body
      content, // text
      delay = 0
  }) {
    return {
      Recipients: recipients.map(Email => ({Email})),
        Content: {
      Body: [
        {
          ContentType: contentType,
          Content: content
        }
      ],
        From: this.SENDER,
        Subject: subject
    },
      Options: {
        TimeOffset: parseInt(delay.toString())
      }
    }
  }




}