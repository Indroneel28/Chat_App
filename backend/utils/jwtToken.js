import jwt from 'jsonwebtoken';

export const generateJWtToken = async (user, statusCode, message, res) => {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });

    res
        .status(statusCode)
        .cookie("token", token, {
            httpOnly: true,
            maxAge: process.env.COOKIE_EXPIRE,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "development" ? false : true,
        })
        .json({
            success: true,
            message,
            token
        })
}