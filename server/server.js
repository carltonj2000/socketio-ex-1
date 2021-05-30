const { instrument } = require("@socket.io/admin-ui");

const io = require("socket.io")(3000, {
  cors: { origin: ["http://localhost:8080", "https://admin.socket.io"] },
});

io.on("connection", (socket) => {
  console.log(socket.id);
  socket.on("custom-event", (number, string, obj) => {
    console.log({ number, string, obj });
  });
  socket.on("message", (message, room) => {
    if (room === "") {
      socket.broadcast.emit("message-bc", message);
    } else {
      socket.to(room).emit("message-bc", message);
    }
    console.log({ message });
  });
  socket.on("join-room", (room, cb) => {
    if (room === "") return;
    socket.join(room);
    cb(`Joined ${room}`);
  });
  socket.on("ping", (count) => {
    console.log("count", count);
  });
});

instrument(io, { auth: false });

const userIo = io.of("/user");

userIo.on("connection", (socket) => {
  console.log(`connected to user namespace as ${socket.username}`);
});

const getUsernameFromToken = (token) => {
  console.log("got user from test");
  return token;
};
userIo.use((socket, next) => {
  if (socket.handshake.auth.token === "Test") {
    console.log("got auth of test");
    socket.username = getUsernameFromToken(socket.handshake.auth.token);
    next();
  } else {
    console.log("filed to get auth of test");
    next(new Error("Please send a toke"));
  }
});
