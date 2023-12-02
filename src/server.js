
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
  // frontend에서 보낸 메시지 받기, emit과 on의 event 이름은 같아야 된다.
  // msg는 javascript 객체다.
  // done은 emit의 3번째 arg, 콜백함수다.(이름은 아무거나 상관없다.)
  socket.on("enter_room", (roomName, done) => {
    console.log(roomName)
    setTimeout(() => {
      // frontend 함수를 서버에서 호출
      done("hello from the backend")
    }, 1000)
  })
})

httpServer.listen(3000, handleListen)