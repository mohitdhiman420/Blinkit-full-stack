const verifyEmailTemplate = ({ name, url }) => {
  return `
    <p>Dear ${name},</p>

    <p>Thank you for registering with Blinkit.</p>

    <p>Welcome to Blinkit Grocery.</p>

    <a
      href="${url}"
      target="_blank"
      style="
        color: white;
        background: orange;
        padding: 12px 20px;
        text-decoration: none;
        display: inline-block;
        border-radius: 5px;
      "
    >
      Verify Email
    </a>
  `;
};

module.exports = verifyEmailTemplate;