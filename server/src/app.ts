import express from 'express';
import { createServer } from 'node:http';
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT
const ORIGIN_URL = process.env.ORIGIN_URL

const app = express();
app.use(cors());
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: ORIGIN_URL,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("join_room", (data) => {
    socket.join(data);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
  });
});


app.get('/test', (_req, res) => {
  res.send('Hello World from chat with node, ts and socket.io is working!');
});

server.listen(PORT, () => {
  return console.log(`Express is listening at http://localhost:${PORT}`);
});