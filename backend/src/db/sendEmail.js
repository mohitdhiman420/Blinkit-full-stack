const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API);

async function sendEmail({ name, sendto, subject, html }) {
  const { data, error } = await resend.emails.send({
    from: "Blinkit <onboarding@resend.dev>",
    to: sendto,
    subject: subject,
    html: html,
  });

  if (error) {
    return console.error({ error });
  }
  return data
}


module.exports = sendEmail

