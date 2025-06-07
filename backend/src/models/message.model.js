import mongoose from "mongoose";

// ✅ FIX THIS in message.model.js
const messageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  reciverId: { // keep this name to match saved messages
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  text: String,
  image: String,
}, { timestamps: true });

const Message = mongoose.model("Message", messageSchema);
export default Message;
