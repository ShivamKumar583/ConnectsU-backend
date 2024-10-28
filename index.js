const express = require('express');
const database = require('./config/database');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const {cloudinaryConnect} = require('./config/cloudinary');
const fileUpload = require('express-fileupload');
const dotenv = require('dotenv');
const {Server} = require('socket.io');
const authRoutes = require("./routes/auth.route.js");
const userRoutes = require("./routes/user.route.js");
const ConversationRoutes = require("./routes/conversation.route.js");
const MessageRoutes = require("./routes/message.route.js");
const {SocketServer} = require('./SocketServer.js')
const PORT = process.env.PORT || 4000;
const http = require('http')

// datdbase connect 
database.connect();
const app = express();
 
app.use(cors({
    origin: "http://localhost:3000",
    methods:['GET' , 'POST','DELETE' , 'PUT'],
    credentials: true,
}));


// middleware
app.use(express.json());
app.use(cookieParser());

app.use(
    fileUpload({
        useTempFiles:true,
        tempFileDir:'/tmp',
    })
)
let server;

server = app.listen(PORT , () => {
    console.log(`App is running at server ${PORT}`);
})

// socket connection 
const io = new Server(server,{
    pingTimeout:60000,
    cors:{
        origin:"http://localhost:3000",
        methods:['GET' , 'POST' , 'DELETE' , 'PUT'],
        credentials:true, 
    }
}); 

io.on('connection' , (socket) =>{
    console.log('socket io connected successfully');
    SocketServer(socket,io)
})
  
// cloudinary connection
cloudinaryConnect();

// routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/conversation", ConversationRoutes);
app.use("/api/v1/message", MessageRoutes);


// def route
app.get('/' , (req,res) => {
    return res.json({
        success:true,
        message:'Your server is up and running.'
    })
})

