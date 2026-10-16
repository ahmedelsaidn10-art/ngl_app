import * as userRepository from '../../user/repository/user.repository.js';
import * as OtpRepository from '../../auth/repository/otp.repository.js';
import { sendEmail } from './../../../common/email/nodemailer.js';
import * as authErrors from '../errors.js';
import * as userErrors from '../../user/errors.js';
import { hashPassword, comparePassword } from '../utils/bcrypt.utils.js';
import { generateOtp } from '../utils/crypto.utils.js';
import { generateToken } from '../utils/jsonwebtoken.utils.js';
import { verifyGoogleToken } from '../../../common/utils/googel.auth.js';
export const register = async (userData) => {

    const existingUser = await userRepository.checkUserExistsByEmail(userData.email);

    if (existingUser) {
        throw userErrors.USER_ALREADY_EXISTS;
    }


    userData.password = await hashPassword(userData.password);

    const newUser = await userRepository.createUser(userData);

    const otp = generateOtp();


    await OtpRepository.generateOTP(
        {
            code: otp,
            email: userData.email,
            expiresAt: new Date(Date.now() + 1000 * 60 * 5)
        }
    );

    await sendEmail(
        userData.email,
        'OTP for Registration',
        `Your OTP is: ${otp}`
    );

    return newUser;


}

export const verifyAccount = async (email, otp) => {

    const user = await userRepository.checkUserExistsByEmail(email);

    if (!user) {
        throw userErrors.USER_NOT_EXISTS;
    }

    if (user.isVerified === true) {
        throw authErrors.ACCOUNT_ALREADY_VERIFIED;
    }

    const otpData = await OtpRepository.getOTPByEmail(email);

    if (!otpData) {
        throw authErrors.OTP_EXPIRED;
    }

    if (otpData.code !== otp) {
        throw authErrors.INVALID_OTP;
    }

    const updatedUser = await userRepository.updateUser(email, { isVerified: true });
    await OtpRepository.deleteOTPByEmail(email);

    return updatedUser;
}

export const login = async (email, password) => {
    const user = await userRepository.checkUserExistsByEmail(email);

    if (!user) {
        throw userErrors.USER_NOT_EXISTS;
    }

    if (user.isVerified === false) {
        throw authErrors.ACCOUNT_NOT_VERIFIED;
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
        throw authErrors.INVALID_PASSWORD;
    }

    const token = generateToken({ name: user.name, email: user.email });

    return token;
}

export const sendOtp = async (email) => {
    const user = await userRepository.checkUserExistsByEmail(email);
    if (!user) {
        throw userErrors.USER_NOT_EXISTS;
    }

    await OtpRepository.deleteOTPByEmail(email);

    const otp = generateOtp();

    await OtpRepository.generateOTP(
        {
            code: otp,
            email: email,
            expiresAt: new Date(Date.now() + 1000 * 60 * 5)
        }
    );

    await sendEmail(
        email,
        'OTP for Password Reset',
        `Your OTP is: ${otp}`
    );

}

export const resetPassword = async (email, otp, newPassword) => {
    const user = await userRepository.checkUserExistsByEmail(email);
    if (!user) {
        throw userErrors.USER_NOT_EXISTS;
    }

    const otpData = await OtpRepository.getOTPByEmail(email);
    if (!otpData) {
        throw authErrors.OTP_EXPIRED;
    }

    if (otpData.code !== otp) {
        throw authErrors.INVALID_OTP;
    }

    newPassword = await hashPassword(newPassword);
    const updatedUser = await userRepository.updateUser(email, { password: newPassword });
    await OtpRepository.deleteOTPByEmail(email);

    return updatedUser;
}



export const loginwithgoogle = async (idtoken) => {
    const googleUser = await verifyGoogleToken(idtoken);
    const user = await userRepository.checkUserExistsByEmail(googleUser.email);
    if (!user) {
        const newUser = await userRepository.createUser({
            name: googleUser.name,
            email: googleUser.email,
            isVerified: true,
            provider: 'google'
        });
        const token = generateToken({ name: newUser.name, email: newUser.email });
        return token;
    }
    const token = generateToken({ name: user.name, email: user.email });
    return token;
}