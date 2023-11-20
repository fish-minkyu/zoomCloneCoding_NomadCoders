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

// Fake Database 만들기
// 누군가 우리 서버에 연결하면 그 connection을 넣을 것이다.
// 이렇게 하면 받은 메시지를 다른 모든 socket에 전달할 수 있다.
const sockets = []


// connection (on method)
// connection이 생겼을 때 socket으로 즉시 메시지 보내기
wss.on('connection', (socket) => {
  // 서버에 연결된 브라우저를 sockets 배열에 넣어주기
  sockets.push(socket)

  console.log(`Connect to Browser ✅`);

  // 브라우저의 연결이 끊긴 close 이벤트 listen, 콘솔 출력
  socket.on('close', () => {
    console.log('Disconnected from the browser ❌')
  });

  socket.on('message', (message) => {
    sockets.forEach(aSocket => {
      // Buffer를 문자열로 반환
      const decodedMessage = message.toString('utf-8')
      aSocket.send(decodedMessage)
    })
  });
});


server.listen(3000, handleListen)