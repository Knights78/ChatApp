const express = require('express');
const { Server } = require('socket.io');
const http = require('http');
const getUserDetailsFromToken = require('../helpers/getUserDetailsFromToken');
const userModel = require('../models/User');
const { conversationModel, messageModel } = require('../models/Conversation');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        credentials: true
    }
});

const onlineUser = new Set(); // in set every online user id will be different

io.on('connection', async (socket) => { // whenever any user will be connected
    console.log('connect user', socket.id);
    const token = socket.handshake.auth.token;
    const user = await getUserDetailsFromToken(token);

    // create a room
    socket.join(user?._id.toString());
    onlineUser.add(user?._id?.toString()); // it is adding the particular user into the onlineUser set
    io.emit('onlineUser', Array.from(onlineUser)); // to send it to the frontend emit is used to trigger  

    socket.on('messagePage', async (userId) => { // this userId is coming from the message section socket.emit MessagePage
        const userDetails = await userModel.findById(userId).select('-password');
        const payload = {
            _id: userDetails._id,
            name: userDetails.name,
            email: userDetails.email,
            profile_pic: userDetails.profile_pic,
            online: onlineUser.has(userId)
        };

        socket.emit('message-user', payload);

        // get previous messages
        const getConversation = await conversationModel.findOne({
            "$or": [
                { sender: user?._id, receiver: userId },
                { sender: userId, receiver: user?._id }
            ]
        }).populate('messages').sort({ updateAt: -1 }); // populate method is used to render the collection in our case we are passing the messages from the conversation

        socket.emit('message', getConversation.messages || []);
    });

    socket.on('new message', async (data) => {
        // check if conversation is available between both users
        let conversation = await conversationModel.findOne({
            "$or": [
                { sender: data?.sender, receiver: data?.receiver },
                { sender: data?.receiver, receiver: data?.sender }
            ]
        });

        // if conversation is not available
        if (!conversation) {
            const createConversation = await conversationModel({
                sender: data?.sender,
                receiver: data?.receiver
            });
            conversation = await createConversation.save();
        }

        const message = new messageModel({
            text: data.text,
            ImageUrl: data.ImageUrl,
            VideoUrl: data.VideoUrl,
            msgByUserId: data?.msgByUserId,
        });
        const saveMessage = await message.save();

        await conversationModel.updateOne({ _id: conversation?._id }, {
            "$push": { messages: saveMessage?._id }
        });

        const getConversationMessage = await conversationModel.findOne({
            "$or": [
                { sender: data?.sender, receiver: data?.receiver },
                { sender: data?.receiver, receiver: data?.sender }
            ]
        }).populate('messages').sort({ updatedAt: -1 });

        io.to(data?.sender).emit('message', getConversationMessage?.messages || []);
        io.to(data?.receiver).emit('message', getConversationMessage?.messages || []);
    });

    socket.on('disconnect', () => {
        onlineUser.delete(user?._id); // on disconnection delete that user
        console.log('disconnect user', socket.id);
    });
});

module.exports = {
    app,
    server
};
