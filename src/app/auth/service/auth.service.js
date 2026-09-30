import * as userRepository from '../../user/repository/user.repository.js';
import * as OtpRepository from '../../auth/repository/otp.repository.js';
import bcrypt from 'bcrypt';
import crypto from 'node:crypto';
import { sendEmail } from './../../../common/email/nodemailer.js';
import jwt from "jsonwebtoken";
export const register = async (userData) => {

    const existingUser = await userRepository.checkUserExistsByEmail(userData.email);

    if (existingUser) {
        throw new Error('User already exists');
    }


    userData.password = await bcrypt.hashSync(userData.password, 10);

    const newUser = await userRepository.createUser(userData);

    const otp = crypto.randomInt(100000, 999999).toString();


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
        throw new Error("User Not Exists");
    }

    if (user.isVerified === true) {
        throw new Error("Account already verified");
    }

    const otpData = await OtpRepository.getOTPByEmail(email);

    if (!otpData) {
        throw new Error("OTP expired");
    }

    if (otpData.code !== otp) {
        throw new Error("Invalid OTP");
    }

    const updatedUser = await userRepository.updateUser(email, { isVerified: true });
    await OtpRepository.deleteOTPByEmail(email);

    return updatedUser;
}

export const login = async (email, password) => {
    const user = await userRepository.checkUserExistsByEmail(email);

    if (!user) {
        throw new Error("User Not Exists")
    }

    if(user.isVerified === false){
        throw new Error("Account Not verified")
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error('Invalid password');
    }

    const token = jwt.sign({ name:user.name , email : user.email } ,process.env.JWT_SECRET , {expiresIn:"1h"})

    return token;
}
 export const sendOtp = async (email) => {
    const user = await userRepository.checkUserExistsByEmail(email);
    if (!user) {
        throw new Error("User Not Exists");
    }
    
    await OtpRepository.deleteOTPByEmail(email);
    
    const otp = crypto.randomInt(100000, 999999).toString();

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