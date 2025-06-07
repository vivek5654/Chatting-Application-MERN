import cloudinary from "../lib/cloudinary.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import { getReceiverSocketId, io } from "../lib/socket.js";



export const getAllUsers = async (req, res) => {
  try {
    const loggedInUser = req.user._id;

    const filteredUsers = await User.find({ _id: { $ne: loggedInUser } }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.log("Error while getting users:", error.message);
    res.status(500).json({ message: "Error while getting users", error: error.message });
  }
};



export const getMessage = async (req, res) => {
  try {
    const { id: userToChat } = req.params;
    const senderId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId, reciverId: userToChat }, // ✅ fixed field name
        { senderId: userToChat, reciverId: senderId }, // ✅ fixed
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
    
  } catch (error) {
    console.log("Error in getMessage:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};



export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: reciverId } = req.params;
    const senderId = req.user._id;
    let imageurl;

    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageurl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      reciverId,
      text, // ✅ corrected
      image: imageurl,
    });

    await newMessage.save();


    const receiverSocketId = getReceiverSocketId(reciverId);
    if(receiverSocketId){
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }



    res.status(200).json(newMessage);
  } catch (error) {
    console.log("❌ error in the sendMessage:", error.message);
    res.status(500).json({ message: error.message });
  }
};


