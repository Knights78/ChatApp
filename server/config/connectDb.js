const mongoose = require('mongoose');

async function connect() {
    try {
        await mongoose.connect(`mongodb+srv://saifushaikh102:zDTATIzI6bY27sjT@testchatapp.axeifgn.mongodb.net/?retryWrites=true&w=majority&appName=testChatApp`);
        const connection = mongoose.connection;

        connection.on('connected', () => {
            console.log("successfully connected database");
        });

        connection.on('error', (error) => {
            console.log("Error occurred in Connect.js", error);
        });
    } catch (error) {
        console.log("Error occurred in Connect.js catch", error);
    }
}

module.exports = connect;
