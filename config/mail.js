const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);


exports.userRegistered = function(email){
  const msg = {
    to: `${email}`,
    from: 'harshitr.x.t.10@gmail.com',
    subject: `Registration Successful`,
    html: `
      <h5> You got this Email because you had registered on the book shop.</h5> 
      <p>Thanks for registring on the book shop</p>
    `
  };
  sgMail.send(msg).then().catch(error => console.log(error.response.body));
}


exports.passwordReset = function(email, token, req){
  const link = `${req.headers.origin}/users/enter-reset-password/${token}`
  const msg = {
    to: `${email}`,
    from: 'harshitr.x.t.10@gmail.com',
    subject: `Reset Password For The Book Shop`,
    // text: `${message}`,
    html: `
      <p> You got this Email because you tried to reset you password for the book shop.</p> 
      <p>click on the link below to reset you password.</p>
      <button style = "padding: 8px 16px"><a href="${link}">Click Here</a></button>
    `
  };
  sgMail.send(msg).then().catch(error => console.log(error.response.body));
}

// module.exports = sendmail;

