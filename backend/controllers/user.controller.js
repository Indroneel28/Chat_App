import { catchAsyncError } from "../middlewares/catchAsyncError.middleware.js"
import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateJWtToken } from "../utils/jwtToken.js";

export const signup = catchAsyncError(async (req, res, next) => {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Please provide all details.'
        })
    }

    //example@gmail.com
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    //min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
    const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!emailRegex.test(email)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid email address.'
        });
    }

    if (!passwordRegex.test(password)) {
        return res.status(400).json({
            success: false,
            message:
                'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.'
        });
    }

    const isEmailAlreadyUsed= await User.findOne({email});

    if(isEmailAlreadyUsed){
        return res.status(400).json({
            success: false,
            message: 'Email is already registered.' 
        });
    }

    const hashedPassword= await bcrypt.hash(password,10);

    const user= await User.create({
        fullName,
        email,
        password: hashedPassword,
        avatar: {
            public_id: "",
            url: "",
        }
    });

    generateJWtToken(user, 'User registered successfully.', 201, res);
})


export const signin = catchAsyncError(async (req, res, next) => {

})

export const signout = catchAsyncError(async (req, res, next) => {

})

export const getUser = catchAsyncError(async (req, res, next) => {

})

export const updateProfile = catchAsyncError(async (req, res, next) => {

})
