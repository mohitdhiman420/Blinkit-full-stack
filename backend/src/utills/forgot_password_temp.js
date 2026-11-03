function forgot_pass_temp({ name, otp }) {
  return `
<div>
    <p>Dear, ${name}</p>

    <p>You requested a password reset. Please use the following OTP to reset your password.</p>

    <div style="background:yellow; font-size:20px; padding:20px; text-align:center; font-weight:800;">
        ${otp}
    </div>

    <p>This OTP is valid for 10 minutes only. Enter this OTP on the Binkeyit website to reset your password.</p>

    <br>

    <p>Thanks,</p>
    <p><b>Binkeyit Team</b></p>
</div>
`;
}

module.exports = forgot_pass_temp;