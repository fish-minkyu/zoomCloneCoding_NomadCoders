
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
  console.log(socket)
})

httpServer.listen(3000, handleListen)