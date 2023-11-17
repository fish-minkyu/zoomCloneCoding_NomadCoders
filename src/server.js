// express server + ws server
// express는 ws를 지원하지 않으므로 function을 추가해야 한다.
import express from "express"
import http from "http" // 따로 설치할 필요가 없다. 이미 node.js에 설치되어 있기 때문
import WebSocket from "ws"

const app = express()

app.set("view engine", "pug")
app.set("views", __dirname + "/views")
app.use("/public", express.static(__dirname + "/public"))
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"))

const handleListen = () => console.log("http://localhost:3000")

// http 서버
// 서버를 만들려고 하는데 createServer를 하려면 requestListener 경로가 있어야 한다.
// 이 서버로부터 webSocket을 만들 수 있다.
const server = http.createServer(app) // Exprss application으로부터 서버를 만든다.

// webSocket 서버
const wss = new WebSocket.Server({ server }) // server 전달

// => 이렇게 하면, http 서버 & webSocket 서버 둘 다 돌릴 수 있다. (2개의 서버가 같은 port에 작동하기를 원하기 때문에)
// 꼭 이렇게 할 필요는 없다. http 서버가 필요 없다면 webSocket 서버만 만들면 된다.

// app.listen처럼 크게 달라진 것은 없어 보이지만 아주 큰 변화다.
// 이 변화의 요점은 내 http 서버에 access하려는 것이다.
// 그래서 http 서버 위에 webSocket 서버를 만들 수 있도록 하는 것이다.
// (views, static files, home, redirection을 원해서 http서버를 만들었다.)
server.listen(3000, handleListen)

