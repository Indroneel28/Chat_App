import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';
import { catchAsyncError } from './catchAsyncError.middleware.js';

export const isAuthenticated = catchAsyncError(async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'User is not authenticated. Please log in to access this resource.'
        });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if(!decoded){
        return res.status(401).json({
            success: false,
            message: 'Invalid token. Please log in again.'
        });
    }

    const user= await User.findById(decoded.id);
    req.user = user;
    next();
});



