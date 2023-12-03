// /socket.io/socket.io.js 연결
const socket = io()

// welcome div에서 form 가져오기
// 방 이름 입력 -> 버튼 Enter Room 클릭
const welcome = document.getElementById("welcome")
  // form 가져오기
const form = welcome.querySelector("form")
// 채팅 방
const room = document.getElementById("room")
// 방에 입장하기 전까지 채팅 방 숨기기
room.hidden = true

// roomName 변수 선언
let roomName

// 채팅 메시지 보내는 함수 (발송)
function handleMessageSubmit(event) {
  event.preventDefault()
  const input = room.querySelector("input")
  // value 변수를 만든 이유
  // : socket.emit()함수를 실행하고 input.value을 비우면 메시지가 사라진다.
  // 그 이유는 socket.emit() 실행할 때 input.value은 이미 없어졌기 때문이다.
  // socket.emit() 실행 -> 백엔드에 전달 -> input.value = "" -> handleMessageSubmit 종료 -> socket.emit 콜백 함수 실행
  const value = input.value 
  // 1. 메시지 이벤트 이름, 2. 채팅 방 이름, 3. 메시지 내용, 4. addMessage 콜백 함수
  socket.emit("new_message", roomName, input.value, () => {
    // 본인 채팅 메시지 수신
    // : 메시지를 보내면 내 채팅창에 해당 메시지가 뜬다.
    addMessage(`You: ${value}`)
  })
  input.value = ""
}

// 상대방 채팅 메시지 수신
// : 메시지를 보내면 상대방 채팅창에 해당 메시지가 뜬다.
// socket.on("new_message", addMessage) === socket.on("new_message", (msg) => {addMessage(msg)})
// : 그 이유는 argument와 함께 function을 호출한다.
socket.on("new_message", addMessage)

// 방 입장 후, 방 입장 form은 숨기기, 채팅 방 foam은 나타내기
function showRoom() {
  // 방 입력 숨기기
  welcome.hidden = true
  // 채팅 방 나타내기
  room.hidden = false
  // 방에 입장했다는 걸 사용자에게 알리기
  const h3 = room.querySelector("h3")
  h3.innerText = `Room ${roomName}`
  // 채팅 방 form 등장
  const form = room.querySelector("form")
  // submit 이벤트를 발생하면 handleMessageSubmit이 실행된다.
  form.addEventListener("submit", handleMessageSubmit)
}

// 방 이름 입력 후 입장하기
function handleRoomSubmit(event) {
  event.preventDefault();
  const input = form.querySelector("input")
  // roomName 보내기
  // enter_room이란 event를 emit해준다. (내가 만들고 싶은 어떤 event라도 만들 수 있다.)
  // emit을 하면 argument를 보낼 수 있다.
  // emit(1. event 이름, 2. 보내고 싶은 payload, 3. 서버에서 호출하는 function)
  socket.emit("enter_room", input.value, showRoom) 
  roomName = input.value
  input.value = ""
}

// submit 이벤트 발생시 handleRoomSubmit 콜백함수 실행
form.addEventListener("submit", handleRoomSubmit)

// 메시지 함수
function addMessage(message) {
  const ul = room.querySelector("ul")
  const li = document.createElement("li")
  li.innerText = message
  ul.appendChild(li)
}

// 백엔드에서 welcome 이벤트가 일어나면 프론트에서 반응하기
socket.on("welcome", () => {
  addMessage("someone joined!")
})

// 유저가 방에 나갈 때
socket.on("bye", () => {
  addMessage("someone left ㅠㅠ")
})