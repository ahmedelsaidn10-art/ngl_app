import {z} from 'zod'

export const registerDto = z.object({
    name: z.string().trim().min(3).max(20),
    email: z.email().toLowerCase().trim(),
    password: z.string().min(6).max(20).trim(),
    dob: z.date().optional(),
    gender: z.enum(['male', 'female']).optional()
})

export const loginDto = z.object({
    email: z.email().toLowerCase().trim(),
    password: z.string().min(6).max(20).trim()
})

export const sendOtpDto = z.object({
    email: z.email().toLowerCase().trim()
})

export const resetPasswordDto = z.object({
    email: z.email().toLowerCase().trim(),
    newPassword: z.string().min(6).max(20).trim(),
    otp: z.string().length(6).trim()
})


export const verifyAccountDto = z.object({
    email: z.email().toLowerCase().trim(),
    otp: z.string().length(6).trim()
})

export const loginWithGoogleDto = z.object({
    idToken: z.string().trim().min(1)
})
