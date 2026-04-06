import { catchAsyncError } from "../middlewares/catchAsyncError.middleware.js"
import { User } from "../models/user.model.js";
import { Message } from "../models/message.model.js";
import { v2 as cloudinary } from "cloudinary";
import { getReceiverSockedId } from "../utils/socket.js";

export const getAllUsers = catchAsyncError(async (req, res, next) => {
    const user = req.user;
    const filteredUsers = await User.find({ _id: { $ne: user._id } }).select("-password");
    res.status(200).json({
        success: true,
        users: filteredUsers
    });
});

export const getMessages = catchAsyncError(async (req, res, next) => {
    const receiverId = req.params.id;
    const myId = req.user._id;

    const receiver = await User.findById(receiverId);
    if (!receiver) {
        return res.status(400).json({
            success: false,
            message: "Receiver ID Invalid."
        });
    }

    const messages = await Message.find({
        $or: [
            { senderId: myId, receiverId: receiverId },
            { senderId: receiverId, receiverId: myId }
        ]
    }).sort({ createdAt: 1 });

    res.status(200).json({
        success: true,
        messages
    })
})

export const sendMessage = catchAsyncError(async (req, res, next) => {
    const { text } = req.body;
    const media = req?.files?.media;
    const { id: receiverId } = req.params.id; //id is aliased as receiverId
    const senderId = req.user._id;

    //CHECK WHETHER RECEIVER ID IS VALID
    const receiver = await User.findById(receiverId);
    if (!receiver) {
        return res.status(400).json({
            success: false,
            message: "Receiver ID is Invalid"
        })
    }

    //CHECK WHETHER MEDIA OR TEXT IS THERE
    const sanitizedText = text?.trim() || "";
    if (!text && !media) {
        return res.status(400).json({
            success: false,
            message: "Cannot send empty message"
        })
    }

    //STORE THE MEDIA IN CLOUDINARY
    let mediaURL = "";
    if (media) {
        try {
            const uploadResponse = await cloudinary.uploader.upload(
                media.tempFilePath, {
                resource_type: "auto", //auto-detect image or video
                folder: "CHAT_APP_MEDIA",
                transformation: [
                    {
                        width: 1080,
                        height: 1080,
                        crop: "limit"
                    },
                    {
                        quality: "auto"
                    },
                    {
                        fetch_format: "auto"
                    }
                ]
            }
            );

            mediaURL = uploadResponse?.secure_url;
        }
        catch (error) {
            console.error("Error uploading avatar to Cloudinary:", error);
            return res.status(500).json({
                success: false,
                message: 'Failed to upload media. Please try again later.'
            });
        }
    }

    const newMessage = await Message.create({
        senderId,
        receiverId,
        text: sanitizedText,
        media: mediaURL
    });

    const receiverSocketId = getReceiverSockedId(receiverId);
    if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(200).json({
        success: true,
        message: newMessage
    })

    //NOTIFY THE RECIEVER (using SOCKET>IO)

});

