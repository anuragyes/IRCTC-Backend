
const nodemailer = require("nodemailer");
const { config } = require("../config");

const OTP_EXPIRY_MINUTES = config.OTP_EXPIRATION || 5;

// Create transporter
const transporter = nodemailer.createTransport({
    host: config.SMTP_HOST || "smtp.gmail.com",
    port: Number(config.SMTP_PORT) || 587,
    secure: Number(config.SMTP_PORT) === 465,
    auth: {
        user: config.SMTP_USER,
        pass: config.SMTP_PASS
    }
});

// Verify SMTP connection once at startup
transporter.verify()
    .then(() => console.log("✅ SMTP Server is ready"))
    .catch(err => console.error("❌ SMTP Error:", err));

// Generic email sender
async function sendEmail({ to, subject, text, html }) {


    console.log("this is ", to, "subject is this ", subject, "text is this", text)

    if (!to) {
        throw new Error("Recipient email (to) is required");
    }

    console.log("this is ", to, "subject is this ", subject, "text is this", text)

    if (!config.SMTP_USER || !config.SMTP_PASS) {
        throw new Error("SMTP credentials missing in .env");
    }

    const mailOptions = {
        from: `"IRCTC Support" <${config.SMTP_USER}>`,
        to: String(to).trim(),
        subject,
        text,
        html
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("✅ Email sent:", info.messageId);
        return info;
    } catch (error) {
        console.error("❌ Email failed:", error.message);
        throw error;
    }
}

// OTP Email
async function sendOTPEmail(email, otp) {

    if (!email || !otp) {
        throw new Error("Email and OTP are required");
    }

    const subject = "Your Verification Code";

    const text = `Your OTP is: ${otp}
This code expires in ${OTP_EXPIRY_MINUTES} minutes.`;

    const html = `
        <div style="font-family: Arial; padding:20px;">
            <h2>Email Verification</h2>
            <h1 style="letter-spacing:6px;">${otp}</h1>
            <p>This code expires in ${OTP_EXPIRY_MINUTES} minutes.</p>
        </div>
    `;

    return sendEmail({ to: email, subject, text, html });
}

module.exports = {
    sendEmail,
    sendOTPEmail
};
