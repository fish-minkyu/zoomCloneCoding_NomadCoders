// /socket.io/socket.io.js 연결
const socket = io()

// welcome div에서 form 가져오기
const welcome = document.getElementById("welcome")
  // form 가져오기
const form = welcome.querySelector("form")

function handleRoomSubmit(event) {
  event.preventDefault();
  const input = form.querySelector("input")
  // 메시지 보내기
  // enter_room이란 event를 emit해준다. (내가 만들고 싶은 어떤 event라도 만들 수 있다.)
  // emit을 하면 argument를 보낼 수 있다.
  // emit(1. event 이름, 2. 보내고 싶은 payload, 3. 서버에서 호출하는 function)
  socket.emit("enter_room", { payload: input.value }, () => {
    console.log("server is done!")
  }) 
  input.value = ""
}

form.addEventListener("submit", handleRoomSubmit)