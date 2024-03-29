import { io } from "socket.io-client";

const URL = "https://givehub-server.onrender.com";

export const socket = io(URL);
