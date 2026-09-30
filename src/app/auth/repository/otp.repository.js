import {OTP} from '../../auth/model/otp.model.js';

 export const generateOTP = async (otpData) => {

   return await  OTP.create(otpData);

}


export const getOTPByEmail = async (email) => {

    return await OTP.findOne({email: email});
}

export const deleteOTPByEmail = async (email) => {

    return await OTP.deleteMany({email: email});
}




