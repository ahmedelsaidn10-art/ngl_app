import { OAuth2Client } from "google-auth-library";
import * as authErrors from '../../app/auth/errors.js';
const client = new OAuth2Client();
export const verifyGoogleToken = async (idToken) => {
    try {
        const ticket = await client.verifyIdToken({ idToken: idToken  , audience: process.env.GOOGLE_CLIENT_ID });
        return ticket.getPayload();
    } catch (error) {
        throw authErrors.INVALID_GOOGLE_TOKEN;
    }
}