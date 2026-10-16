import { AppError } from "../../common/error/error.js";

export const ACCOUNT_ALREADY_VERIFIED = new AppError('Account already verified', 400)
export const OTP_EXPIRED = new AppError('OTP expired', 404)
export const INVALID_OTP = new AppError('Invalid OTP', 400)
export const ACCOUNT_NOT_VERIFIED = new AppError('Account Not verified', 403)
export const INVALID_PASSWORD = new AppError('Invalid password', 403)
export const INVALID_GOOGLE_TOKEN = new AppError('Invalid Google token', 403)



