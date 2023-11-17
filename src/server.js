// express server + ws server
import express from "express"
import http from "http" 
import WebSocket from "ws"

const app = express()

app.set("view engine", "pug")
app.set("views", __dirname + "/views")
app.use("/public", express.static(__dirname + "/public"))
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"))

const handleListen = () => console.log("http://localhost:3000")

// http 서버
const server = http.createServer(app) 

// webSocket 서버
const wss = new WebSocket.Server({ server }) // server 전달

// server.js의 socket은 연결된 브라우저를 뜻한다.
function handleConnection(socket) {
	console.log(socket) // 여기 있는 socket이 frontend와 실시간으로 소통할 수 있다.
}

// connection (on method)
// : 누군가 우리와 연결했다란 뜻
// cb의 socket
// : 연결된 브라우저와의 contact(연락)라인이다.
// socket을 이용하면 메시지 주고 받기를 할 수 있다.
// socket은 서버와 브라우저 사이의 연결이다.
wss.on('connection', handleConnection)

server.listen(3000, handleListen)

