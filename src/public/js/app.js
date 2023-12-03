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

let roomName

function showRoom() {
  // 방 입력 숨기기
  welcome.hidden = true
  // 채팅 창 나타내기
  room.hidden = false
  // 방에 입장했다는 걸 사용자에게 알리기
  const h3 = room.querySelector("h3")
  h3.innerText = `Room ${roomName}`
}


function handleRoomSubmit(event) {
  event.preventDefault();
  const input = form.querySelector("input")
  // 메시지 보내기
  // enter_room이란 event를 emit해준다. (내가 만들고 싶은 어떤 event라도 만들 수 있다.)
  // emit을 하면 argument를 보낼 수 있다.
  // emit(1. event 이름, 2. 보내고 싶은 payload, 3. 서버에서 호출하는 function)
  socket.emit("enter_room", input.value, showRoom) 
  roomName = input.value
  input.value = ""
}

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