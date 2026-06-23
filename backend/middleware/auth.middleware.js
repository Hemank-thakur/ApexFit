import jwt from 'jsonwebtoken';
import UserAccount from '../models/userAccount.model.js';

const JWT_SECRET = process.env.JWT_SECRET || 'apexfitsecretkey_2026';

export const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, JWT_SECRET);

            // Get user from the token
            req.user = await UserAccount.findById(decoded.id).select('-password');
            
            if (!req.user) {
                return res.status(401).json({ error: "User account no longer exists" });
            }

            next();
        } catch (error) {
            console.error("Token verification error:", error);
            return res.status(401).json({ error: "Not authorized, token failed" });
        }
    }

    if (!token) {
        return res.status(401).json({ error: "Not authorized, no token provided" });
    }
};
