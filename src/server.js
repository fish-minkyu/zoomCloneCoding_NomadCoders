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

// connection (on method)
// connection이 생겼을 때 socket으로 즉시 메시지 보내기
wss.on('connection', (socket) => {
  console.log(`Connect to Browser ✅`);

  // 브라우저의 연결이 끊긴 close 이벤트 listen, 콘솔 출력
  socket.on('close', () => {
    console.log('Disconnected from the browser ❌')
  });

  // 메시지 이벤트 listen, 메시지 출력 (frontend -> backend)
  socket.on('message', message => { // message 콘솔 값, <Buffer 68 65 6c 6c 6f 20 66 72 6f 6d 20 74 68 65 20 62 72 6f 77 73 65 72>
    const decodedMessage = message.toString('utf-8'); // Buffer 데이터를 문자열로 반환
    console.log(decodedMessage)
  });

  // 브라우저에 메시지 보내기
  socket.send('hello');
});


server.listen(3000, handleListen)

