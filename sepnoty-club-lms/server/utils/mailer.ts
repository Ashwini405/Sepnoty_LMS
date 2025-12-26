import nodemailer from "nodemailer";

export const sendOTP = async (email: string, otp: string) => {
  console.log("📨 Preparing email transport...");

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",   // ✅ FIXED
    port: 587,                // ✅ FIXED
    secure: false,            // ✅ MUST be false for 587
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // 🔎 VERIFY SMTP CONNECTION
  await transporter.verify();
  console.log("✅ SMTP connection verified");

  const info = await transporter.sendMail({
    from: `"Sepnoty Club" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP is: ${otp}`,
    html: `
      <div style="font-family: Arial; padding: 20px">
        <h2>Sepnoty Club Login</h2>
        <p>Your OTP code is:</p>
        <h1>${otp}</h1>
        <p>This code expires in 5 minutes.</p>
      </div>
    `,
  });

  console.log("📧 OTP email sent:", info.messageId);
};
