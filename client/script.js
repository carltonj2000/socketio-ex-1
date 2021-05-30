import { io } from "socket.io-client";

const form = document.getElementById("form");
const roomInput = document.getElementById("room-input");
const joinRoomButton = document.getElementById("room-button");
const messageInput = document.getElementById("message-input");

const socket = io("http://localhost:3000");

socket.on("connect", () => {
  displayMessage(`You connected with id ${socket.id}`);
  socket.emit("custom-event", 10, "hi", { a: 10 });
});

socket.on("message-bc", (message) => {
  displayMessage(`rec ${message}`);
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = messageInput.value;
  const room = roomInput.value;
  if (message === "") return;
  displayMessage(message);
  socket.emit("message", message, room);
  messageInput.value = "";
});

joinRoomButton.addEventListener("click", () => {
  const room = roomInput.value;
  socket.emit("join-room", room, (message) => {
    displayMessage(message);
  });
});

function displayMessage(message) {
  const div = document.createElement("div");
  div.textContent = message;
  document.getElementById("message-container").append(div);
}

const userSocket = io("http://localhost:3000/user", {
  auth: { token: "Test" },
});

// to see error below corrupt token above
userSocket.on("connect_error", (error) => {
  displayMessage(error);
});

document.addEventListener("keydown", (e) => {
  if (e.target.matches("input")) return;
  if (e.key === "c") socket.connect();
  if (e.key === "d") socket.disconnect();
});

let count = 0;
setInterval(() => {
  //socket.emit("ping", ++count); // queues ping when not connected
  socket.volatile.emit("ping", ++count);
}, 1000);
