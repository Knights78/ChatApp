const connect = require('./config/connectDb');
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const bodyParser = require('body-parser');
const router = require('./routes/index.js');
var cookieParser = require('cookie-parser');
const {app,server}=require('./socket/index.js')


// const app = express();
app.use(cookieParser());
app.use(bodyParser.json());
// Middleware setup
app.use(cors({
    origin:'http://localhost:3000',
    credentials: true
}));
app.use(express.json());

// app.use((req, res, next) => {
//     console.log('Cookie header:', req.cookies);
//     next();
//   });

// Routes setup
app.use('/api/user', router);

const portno = process.env.PORT || 4000;

// Database connection and server start
connect().then(() => {
    server.listen(portno, () => {
        console.log("Server running at " + portno);
    });
}).catch((err) => {
    console.error("Database connection error: ", err);
});
