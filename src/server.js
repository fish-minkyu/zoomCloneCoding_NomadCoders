
import express from "express"
import http from "http" 
import { Server } from "socket.io"
import { instrument } from "@socket.io/admin-ui"

const app = express()

app.set("view engine", "pug")
app.set("views", __dirname + "/views")
app.use("/public", express.static(__dirname + "/public"))
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"))

const handleListen = () => console.log("http://localhost:3000")

// http 서버
const httpServer = http.createServer(app) 

// SocketIO 서버(HTTP 위에 쌓아 올려서 만듬)
const io = new Server(httpServer, {
  cors: {
    origin: ["https://admin.socket.io"],
    credentials: true
  }
});

instrument(io, {
  auth: false
});


// public rooms(배열)을 주는 function
function publicRooms() {
  // io 서버 안에 있는 sids와 rooms 가져오기
  // const sids = io.sockets.adapter.sids
  // const rooms = io.sockets.adapter.rooms
  const {sockets: { adapter: { sids, rooms } }} = io
  // public rooms 찾기
  const publicRooms = []
  rooms.forEach((_, key) => {
    if (sids.get(key) === undefined) publicRooms.push(key)
  })
  return publicRooms
}

// 같은 방에 유저가 몇명인지 count하기
function countUser(roomName) {
  // 가끔 roomName이 아닐 수도 있으니 옵셔널을 준다.
  return io.sockets.adapter.rooms.get(roomName)?.size
}

// frontend-backend SocketIO 연결
io.on("connection", socket => {
  // 접속 시, nickname은 익명이다.
  socket["nickname"] = "Anonymous"

  // event를 console.log 하기
  socket.onAny((event) => {
    console.log(io.sockets.adapter)
    console.log(`Socket Event: ${event}`) // Socket Event: enter_room
  })

  // 채팅 방에 입장
  // frontend에서 보낸 메시지 받기, emit과 on의 event 이름은 같아야 된다.
  socket.on("enter_room", (roomName, done) => {
    // 방에 들어가기
    socket.join(roomName)
    done() // 백엔드가 호출하고 프론트에서 실행된다.
    socket.to(roomName).emit("welcome", socket.nickname, countUser(roomName)) // welcome 이벤트를 roomName에 있는 모든 사람들에게 emit한다.
    // room_change 이벤트가 발생하면 서버 안에 있는 연결된 모든 소켓들에게 메시지를 보낸다.
    io.sockets.emit("room_change", publicRooms())
  })

  // disconnecting 이벤트 수신 시, bye 이벤트 실행
  socket.on("disconnecting", () => {
    // countRoom(room) -1인 이유는 유저가 나가기 직전이므로 해당 유저를 여전히 포함하고 있기 때문이다.
    socket.rooms.forEach(room => 
      socket.to(room).emit("bye", socket.nickname,  countUser(room) -1))
  })

  // 채팅 방 퇴장
  // 유저가 채팅 방을 떠난 후(= disconnect), 작동된다.
  socket.on("disconnect", () => {
     // 유저가 방을 나갈 때, 모든 소켓 사용자들에게 알려준다.
     io.sockets.emit("room_change", publicRooms())
  })

  // new_message 이벤트 수신 시 실행
  socket.on("new_message", (room, msg, done) => {
    socket.to(room).emit("new_message", `${socket.nickname}: ${msg}`) // new_message 이벤트명이 같아도 상관없다.
    // 작업이 완료되면 done함수를 호출
    done()
  })

  // nickname 이벤트 받기
  // nickname을 socket에 저장하기
  socket.on("nickname", nickname => socket["nickname"] = nickname)
})

httpServer.listen(3000, handleListen)