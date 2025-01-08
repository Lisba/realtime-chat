import express from 'express';
import { createServer } from 'node:http';
import { Server } from "socket.io";
import cors from "cors";

const PORT = 3001;

const app = express();
app.use(cors());
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
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