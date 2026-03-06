const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

const { config } = require("../config");
const { prisma } = require("../Config/prisma")
const { UnauthorizedError, BadRequestError } = require("../utils/errorTypes");
const { verifyRefreshToken } = require("../utils/auth");
const RedisClient = require('../Config/redis');
const { verifyOTPHased, generateAndStoreOtp } = require("../utils/otp");
const { sendEmail, sendOTPEmail } = require("../utils/email");
const redisClient = RedisClient.getInstance();
const { redis } = require("../Config/redis");
const notificationProducer = require("../Kafka/Producer/notification.producer.");
const logger = require("../Config/logger");

const OTP_MAX_PER_HOUR = config.OTP_MAX_PER_HOUR || 5;

/* =========================
   Rotate Refresh Token
========================= */
const rotateRefreshToken = async (refreshToken, deviceId) => {
    if (!refreshToken) {
        throw new UnauthorizedError("Refresh token missing");
    }

    if (!deviceId) {
        throw new UnauthorizedError("Device ID missing");
    }

    let payload;
    try {
        payload = verifyRefreshToken(refreshToken);
    } catch {
        throw new UnauthorizedError("Invalid or expired refresh token");
    }

    const { id: userId, jti } = payload;

    if (!userId || !jti) {
        throw new UnauthorizedError("Invalid refresh token payload");
    }

    // Check stored JTI
    const storedJti = await redisClient.get(`refresh:${userId}:${deviceId}`);

    if (!storedJti) {
        throw new UnauthorizedError("Session expired or revoked");
    }

    if (storedJti !== jti) {
        // possible token reuse attack
        await redisClient.del(`refresh:${userId}:${deviceId}`);
        throw new UnauthorizedError("Refresh token reuse detected");
    }

    // Generate new JTI
    const newJti = uuidv4();

    const newAccessToken = jwt.sign(
        { id: userId },
        config.JWT_SECRET,
        { expiresIn: config.ACCESS_TOKEN_EXP }
    );

    const newRefreshToken = jwt.sign(
        { id: userId, jti: newJti, deviceId },
        config.JWT_REFRESH_SECRET,
        { expiresIn: config.REFRESH_TOKEN_EXP }
    );

    // Rotate stored JTI
    await redisClient.set(
        `refresh:${userId}:${deviceId}`,
        newJti,
        "EX",
        config.REFRESH_TOKEN_EXP_TIME
    );

    return { newAccessToken, newRefreshToken };
};


const login = async (email, password, deviceId) => {
    if (!email || !password) {
        throw new UnauthorizedError("Email and password required");
    }

    const user = await prisma.user.findUnique({
        where: { email }
    });

    if (!user) {
        throw new UnauthorizedError("Invalid email or password");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new UnauthorizedError("Invalid email or password");
    }

    if (!deviceId) {
        throw new UnauthorizedError("Device ID required");
    }

    //  Cache user in Redis
    await redisClient.set(
        `user:${user.id}`,
        JSON.stringify({
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role || "USER"
        }),
        "EX",
        60 * 60 // 1 hour
    );

    const jti = uuidv4();

    const AccessToken = jwt.sign(
        { id: user.id, email: user.email },
        config.JWT_SECRET,
        { expiresIn: config.ACCESS_TOKEN_EXP }
    );

    const RefreshToken = jwt.sign(
        { id: user.id, jti, deviceId },
        config.JWT_REFRESH_SECRET,
        { expiresIn: config.REFRESH_TOKEN_EXP }
    );

    await redisClient.set(
        `refresh:${user.id}:${deviceId}`,
        jti,
        "EX",
        config.REFRESH_TOKEN_EXP_TIME
    );

    return {
        AccessToken,
        RefreshToken,
        loggedInUser: {
            id: user.id,
            email: user.email,
            name: user.name
        }
    };
};





function hmacFor(email, otp) {
    return crypto
        .createHmac("sha256", HMAC_SECRET)
        .update(`${email}:${otp}`)
        .digest("hex");
}


// SEND OTP

const sendOTP = async (email, firstName, lastName, password) => {


      console.log("this is the user deatail",email,firstName,lastName,password)
    const existingUser = await prisma.user.findUnique({
        where: { email }
    });

    if (existingUser) {
        throw new BadRequestError("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    // store and generate the opt 
    const { otp, otpSessionId } = await generateAndStoreOtp({
        email,
        firstName,
        lastName,
        password: hashedPassword
    });

    //   after genertaing the otp we send into the user email ().asyn way)

     await sendOTPEmail(email, otp);  //withoiut kafka 

    //  now we are using kafka to send email which is handle by kafka 
    //   using kafka to send mail .

    // await notificationProducer.sendOTPEmail(email, otp, (config.OTP_TTL) / 60); // email opt and expery
    // logger.info(`otp email queue producer  successfully ${email}`)
    return { otpSessionId };
};



//    VERIFY OTP

const verifyOTP = async (otpSessionId, otp) => {

    const meta = await verifyOTPHased(otpSessionId, otp);

    if (!meta) {
        throw new BadRequestError("Invalid or expired OTP");
    }

    const user = await prisma.user.create({
        data: {
            firstName: meta.firstName,
            lastName: meta.lastName,
            email: meta.email,
            password: meta.password,
            emailVerified: true,
        }
    });

    await sendEmail({
        to: meta.email,
        subject: "OTP Verified Successfully",
        text: "Your OTP was verified successfully.",
        html: "<h2>Your OTP was verified successfully.</h2>"
    });


    return user;
};




module.exports = {
    rotateRefreshToken,
    login,
    verifyOTP,
    sendOTP

};
