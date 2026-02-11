import User from "../models/User.js";
import Message from "../models/Message.js";
import cloudinary from "../lib/Cloudinary.js";
import { userSocketMap, io } from "../server.js";

// Get all users expect the logged in user
export const getUsersForSidebar = async (req, res)=>{
    try{
        const userid = req.user._id;
        const filteredUsers = await User.find({_id: { $ne: userid }}).select("-password");

        // Count number of messages not seen
        const unseenMessages = {}
        const promises = filteredUsers.map(async (user)=>{
            const messages = await Message.find({ senderId: user._id, receiverId: userid, seen: false });
            if(messages.length > 0){
                unseenMessages[user._id] = messages.length;
            }
        })

        await Promise.all(promises);
        res.json({ success: true,  users: filteredUsers, unseenMessages });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

// Get all messages for Selected User
export const getMessages = async (req, res) => {
    try {
        const {id: selecteduserId} = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: selecteduserId },
                { senderId: selecteduserId, receiverId: myId }
            ] 
        }).sort({ createdAt: 1});

        await Message.updateMany({senderId: selecteduserId, receiverId: myId}, { seen: true });
        res.json({ success: true, messages });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

// api to mark message as seen using messageid
export const markMessageAsSeen = async (req, res) => {
    try{
        const message = await Message.findById(messageId);

        if(message.receiverId.toString() !== req.user._id.toString()){
            return res.status(403).json({ message: "Not authorized" });
        }

        const {id: messageId} = req.params;
        await Message.findByIdAndUpdate(messageId, { seen: true });
        res.json({ success: true, message: "Message marked as seen" });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

// Send message to selected user
export const sendMessage =async (req, res) => {
    try{

        const { text, image} = req.body;
        const receiverId = req.params.id;
        const senderId = req.user._id;

        let imageUrl;
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image)
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = await Message.create({
            senderId,
            receiverId,
            text,
            image: imageUrl
        })

        //  Emit the new message to the reciever's socket
        const receiverSocketId = userSocketMap[receiverId];
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.json({success: true, newMessage });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}