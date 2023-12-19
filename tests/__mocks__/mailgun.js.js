class Mailgun {
  client() {
    return {
      messages: {
        create: () => {
          return new Promise((resolve, reject) => {
            resolve();
          });
        },
      },
    };
  }
}

module.exports = Mailgun;
