const messageList = document.querySelector("ul")
const messageForm = document.querySelector("form")
const socket = new WebSocket(`ws://${window.location.host}`)

// 새로고침할 때, 이벤트 리스너가 동작한다.
socket.addEventListener("open", () => {
  console.log("Connected to Server ✅")
})

socket.addEventListener("message", (message) => {
  console.log("New message: ", message.data)
})

socket.addEventListener("close", () => {
  console.log("Disconnected from the Server ❌")
})

function handleSubmit(event) {
  event.preventDefault();
  const input = messageForm.querySelector("input")
  console.log(input.value)
}

messageForm.addEventListener("submit", handleSubmit)