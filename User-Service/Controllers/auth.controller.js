const { http } = require('winston');
const { config } = require('../config');
const authService = require('../Services/auth.service');
const asyncHandler = require('../utils/asyncHandler');
const { BadRequestError, UnauthorizedError } = require('../utils/errorTypes');
const { getDeviceFingerprint } = require('../utils/devicefingureprint');
const { verifyRefreshToken } = require('../utils/auth');




// SEND OTP
exports.sendotp = asyncHandler(async (req, res) => {

    const { email, firstName, lastName, password, confirmPassword } = req.body;

    if (!email || !firstName || !lastName || !password || !confirmPassword) {
        throw new BadRequestError("All fields required");
    }

    if (password !== confirmPassword) {
        throw new BadRequestError("Passwords do not match");
    }

    const { otpSessionId } = await authService.sendOTP(
        email,
        firstName,
        lastName,
        password
    );

    res.cookie("otpSessionId", otpSessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: config.OTP_TTL * 1000
    });

    return res.status(200).json({
        success: true,
        message: "OTP sent successfully"
    });
});


// VERIFY OTP
exports.verifyotp = asyncHandler(async (req, res) => {

    const { otp } = req.body;
    const otpSessionId = req.cookies.otpSessionId;

     console.log("this is otp" , otp);
     console.log("sesion id" , otpSessionId)

    if (!otpSessionId) {
        throw new BadRequestError("Session missing");
    }

    const user = await authService.verifyOTP(otpSessionId, otp);

    res.clearCookie("otpSessionId");

    return res.status(200).json({
        success: true,
        message: "User created successfully",
        data: user
    });
});



exports.LoginDetails = asyncHandler(async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        throw new BadRequestError("Email & password is missing");
    }

    const deviceId = getDeviceFingerprint(req);

    const { AccessToken, RefreshToken, loggedInUser } =
        await authService.login(email, password, deviceId);



    console.log("accessToken is her", AccessToken);
    console.log("RefreshToken is here", RefreshToken);

    res.cookie("accessToken", AccessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: config.ACCESS_TOKEN_EXP_TIME * 1000
    });

    res.cookie("refreshToken", RefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: config.REFRESH_TOKEN_EXP_TIME * 1000
    });

    res.status(200).json({
        message: "Logged In Successfully",
        success: true,
        loggedInUser
    });

});


exports.rotateRefreshToken = asyncHandler(async (req, res) => {

    // 1️ Get refresh token from cookies
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
        throw new UnauthorizedError("Refresh token missing");
    }

    // 2️ Verify refresh token
    let decoded;
    try {
        decoded = verifyRefreshToken(refreshToken);
    } catch (error) {
        throw new UnauthorizedError("Invalid or expired refresh token");
    }

    const { id: userId, jti } = decoded;

    if (!userId || !jti) {
        throw new UnauthorizedError("Invalid refresh token payload");
    }

    // 3️ Get device fingerprint
    const deviceId = getDeviceFingerprint(req);


    const { newAccessToken, newRefreshToken } = await authService.rotateRefreshToken(refreshToken, deviceId)


    // 7️ Send new cookies
    res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: config.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: config.ACCESS_TOKEN_EXP_TIME * 1000
    });

    res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: config.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: config.REFRESH_TOKEN_EXP_TIME * 1000
    });

    res.status(200).json({
        success: true,
        message: "Token rotated successfully"
    });

});
