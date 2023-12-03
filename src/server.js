
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

// frontend-backend SocketIO 연결
io.on("connection", socket => {
  // event를 console.log 하기
  socket.onAny((event) => {
    console.log(`Socket Event: ${event}`) // Socket Event: enter_room
  })

  // frontend에서 보낸 메시지 받기, emit과 on의 event 이름은 같아야 된다.
  socket.on("enter_room", (roomName, done) => {
    // 방에 들어가기
    socket.join(roomName)
    done() // 백엔드가 호출하고 프론트에서 실행된다.
    socket.to(roomName).emit("welcome") // welcome 이벤트를 roomName에 있는 모든 사람들에게 emit한다.
  })

  // disconnecting 이벤트 수신 시, bye 이벤트 실행
  socket.on("disconnecting", () => {
    socket.rooms.forEach(room => socket.to(room).emit("bye"))
  })

  // new_message 이벤트 수신 시 실행
  socket.on("new_message", (room, msg, done) => {
    socket.to(room).emit("new_message", msg) // new_message 이벤트명이 같아도 상관없다.
    // 작업이 완료되면 done함수를 호출
    done()
  })
})

httpServer.listen(3000, handleListen)