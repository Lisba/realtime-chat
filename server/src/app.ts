import express from 'express';
import { createServer } from 'node:http';
import { Server } from "socket.io";
import cors from "cors";

const port = 3000;
const app = express();
app.use(cors());

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});


app.get('/test', (req, res) => {
  res.send('Hello World! TS! Working!');
});

server.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});