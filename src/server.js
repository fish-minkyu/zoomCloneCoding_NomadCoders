
import express from "express"
import http from "http" 
import SocketIO from "socket.io"

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
const io = SocketIO(httpServer)

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
    socket.to(roomName).emit("welcome", socket.nickname) // welcome 이벤트를 roomName에 있는 모든 사람들에게 emit한다.
    // room_change 이벤트가 발생하면 서버 안에 있는 연결된 모든 소켓들에게
    io.sockets.emit("room_change", publicRooms)
  })

  // disconnecting 이벤트 수신 시, bye 이벤트 실행
  socket.on("disconnecting", () => {
    socket.rooms.forEach(room => socket.to(room).emit("bye", socket.nickname))
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