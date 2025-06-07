import jwt from 'jsonwebtoken';

export const generateToken = (userId, res) => {
    try {
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET is not defined');
        }

        const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
            expiresIn: "7d"
        });

        res.cookie('jwt', token, {  // 'jwt' as string for cookie name
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: 'strict',  // Changed to string
            secure: process.env.NODE_ENV !== 'development'
        });

        return token;
    } catch (error) {
        console.error('Error generating token:', error);
        throw error;  // Re-throw to be caught by the calling function
    }
};