import { validateBody } from '../../../common/validation/validation.js';
import { loginDto, registerDto, resetPasswordDto, sendOtpDto, verifyAccountDto, loginWithGoogleDto } from '../dto/auth.dto.js';
import * as authService from '../service/auth.service.js';


export const register = async (req, res, next) => {
    try {

        const date = validateBody(registerDto, req.body)
        // const user = req.body;
        const newUser = await authService.register(date);
        res.status(201).json({ message: 'User registered successfully', user: newUser, success: true });
    } catch (error) {
        next(error);
    }

}

export const verifyAccount = async (req, res, next) => {
    try {
        const date = validateBody(verifyAccountDto, req.body)

        const { email, otp } = date;
        const updatedUser = await authService.verifyAccount(email, otp);
        res.status(200).json({ message: 'Account verified successfully', user: updatedUser, success: true });
    } catch (error) {
        next(error);
    }
};

export const login = async (req, res, next) => {
    try {
        const date = validateBody(loginDto, req.body)
        const { email, password } = date;
        const token = await authService.login(email, password);

        res.cookie('access_token', token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });

        res.status(200).json({ message: 'Login successful', success: true });
    } catch (error) {
        next(error);
    }
};

export const sendOtp = async (req, res, next) => {
    try {
        const date = validateBody(sendOtpDto, req.body)
        const { email } = date;
        await authService.sendOtp(email);
        res.status(200).json({ message: 'OTP sent successfully', success: true });
    } catch (error) {
        next(error);
    }
};

export const resetPassword = async (req, res, next) => {
    try {
        const date = validateBody(resetPasswordDto, req.body)
        const { email, otp, newPassword } = date;
        const updatedUser = await authService.resetPassword(email, otp, newPassword);
        res.status(200).json({ message: 'Password reset successfully', user: updatedUser, success: true });
    } catch (error) {
        next(error);
    }
};

export const loginWithGoogle = async (req, res, next) => {
    try {
        const date = validateBody(loginWithGoogleDto, req.body);
        const { idToken } = date;
        const token = await authService.loginwithgoogle(idToken);
        res.cookie('access_token', token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });
        res.status(200).json({ message: 'Login with Google successful', success: true });
    } catch (error) {
        next(error);
    }
};
