import * as authService from '../service/auth.service.js';


export const register = async (req, res, next) => {
    try {
        const user = req.body;
        const newUser = await authService.register(user);
        res.status(201).json({ message: 'User registered successfully', user: newUser, success: true });
    } catch (error) {
        next(error);
    }

}

export const verifyAccount = async (req, res, next) => {
    try {
        const { email, otp } = req.body;
        const updatedUser = await authService.verifyAccount(email, otp);
        res.status(200).json({ message: 'Account verified successfully', user: updatedUser, success: true });
    } catch (error) {
        next(error);
    }
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
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
        const { email } = req.body;
        await authService.sendOtp(email);
        res.status(200).json({ message: 'OTP sent successfully', success: true });
    } catch (error) {
        next(error);
    }
};
