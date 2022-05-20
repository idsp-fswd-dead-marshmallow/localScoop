const app = require("./app")
const http = require('http');

const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const makeSocketChat = require('./socketChat')
makeSocketChat(io)

const PORT = process.env.PORT || 8000; // let express set PORT, else make it 8000

server.listen(PORT, () => console.log(`server should be running at http://localhost:${PORT}/`))


