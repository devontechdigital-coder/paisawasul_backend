import express from "express";
import cors from "cors";
import morgan from "morgan";
import colors from "colors";
import dotenv from "dotenv";
import connection from "./database/db.js";
import Router from "./routes/routes.js";
import { readFileSync } from 'fs';
import path from 'path';
import http from "http";
import { Server } from "socket.io";
import messageModel from "./models/messageModel.js";
import bodyParser from "body-parser";

import admin from "firebase-admin"; // Import Firebase Admin SDK
import userModel from "./models/userModel.js";

dotenv.config();

const app = express();

 
// const serviceAccountPath = path.resolve('config', './maidapp-5a200-firebase-adminsdk-fbsvc-890ba51a51.json');

// // Read the Firebase service account JSON file

// const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf-8'));

// Initialize Firebase Admin SDK with the service account

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

app.use(cors());


// const allowedOrigins = ['https://cayroshop.com/', 'https://test.ccavenue.com', 'https://secure.ccavenue.com'];

// // Configure CORS with the allowed origins
// app.use(cors({
//   origin: function (origin, callback) {
//     // Check if the origin is in the allowed origins array
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   }
// }));


app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// app.use(morgan("dev"));
app.use(express.static("public"));
app.use("/", Router);



// socket io

const server = http.createServer(app);


const io = new Server(server, {
  cors: {
    // origin: ["http://localhost:3000", "http://localhost:3001", "https://helply.spacedeco.in", "https://adminhelply.spacedeco.in"],
  origin: "*",  // Temporarily allow all origins to test if CORS is the problem
  methods: ["GET", "POST"], // Allow only GET and POST methods
  },
}); // Create a new instance of Socket.io Server and pass the HTTP server to it

// Socket.io events
io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  // Example: Handle chat message event
  socket.on("chat message", (msg) => {
    console.log("message: " + msg);
    // Broadcast the message to all connected clients
    io.emit("chat message", msg);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});


// app.get('/', (req, res) => {
//   res.send('You are not authorized for this action');
// });

// Send push notification route
app.post('/send-push', async (req, res) => {
  const { token, title, body ,userId } = req.body;

  if ( !title || !body) {
    return res.status(400).send('Missing required fields: title, or body');
  }
  if(!userId && !token){
    return res.status(400).send('Missing required fields: token or userId');
  }
  let mtoken = token;
   
  if(userId){
        const exisitingUser = await userModel.findById(userId);
        mtoken = exisitingUser.fcm;
        if(!mtoken){
    return res.status(400).send('user fcm not found');
        }
 
   }
  const message = {
    token: mtoken,
    notification: {
      title: title,
      body: body,
    },
  };

  try {
    // New API uses send()
    const response = await admin.messaging().send(message);
    console.log('Successfully sent message:', response);
    res.status(200).send('Notification sent successfully');
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).send('Failed to send notification');
  }
});

const PORT = 3050;
server.listen(PORT, () =>
  console.log(`server is runnning ${PORT}`.bgCyan.white)
);
  
connection();
