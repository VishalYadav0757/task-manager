const formData = require("form-data");
const Mailgun = require("mailgun.js");

const DOMAIN = "sandboxb293cc5fe01e4e33b9e82815cb6ed17b.mailgun.org";

const mailgun = new Mailgun(formData);
const client = mailgun.client({
  username: "api",
  key: process.env.MAILGUN_API_KEY,
});

const sendWelcomeEmail = (email, name) => {
  client.messages
    .create(DOMAIN, {
      from: "Excited User <kavay35745@anawalls.com>",
      to: email,
      subject: "Hello",
      text: `Welcome ${name} to the task manager application !!`,
    })
    .then((res) => {
      console.log(res);
    })
    .catch((error) => {
      console.log(error);
    });
};

const sendRemoveEmail = (email, name) => {
  client.messages
    .create(DOMAIN, {
      from: "Excited User <kavay35745@anawalls.com>",
      to: email,
      subject: "Hello",
      text: `Hello ${name} it was great serving you !!`,
    })
    .then((res) => {
      console.log(res);
    })
    .catch((error) => {
      console.log(error);
    });
};

module.exports = {
  sendWelcomeEmail,
  sendRemoveEmail,
};
