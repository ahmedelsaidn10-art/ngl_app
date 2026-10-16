import jwt from 'jsonwebtoken';

const TOKEN_EXPIRATION = '1h';

const getJwtSecret = () => {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error('JWT_SECRET is not configured');
    }

    return secret;
};

export const generateToken = (payload) =>
    jwt.sign(payload, getJwtSecret(), { expiresIn: TOKEN_EXPIRATION });

export const verifyToken = (token) => jwt.verify(token, getJwtSecret());
