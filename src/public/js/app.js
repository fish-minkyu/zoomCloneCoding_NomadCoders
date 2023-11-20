// front

const messageList = document.querySelector('ul')
const messageForm = document.querySelector('form')
const socket = new WebSocket(`ws://${window.location.host}`); // window.location.host == http://localhost:3000

// socket이 connection을 open 했을 때 발생한다.
socket.addEventListener('open', () => {
  console.log('connected to Server ✅')
});

// message 이벤트가 발생했을 때
socket.addEventListener('message', (message) => {
  // Buffer를 문자열로 반환
  const decodedMessage=  message.data.toString('utf-8');
  console.log('New message:', decodedMessage);
});

// close 이벤트가 발생했을 때
socket.addEventListener('close', () => {
  console.log('Disconnected from Server ❌')
});

// 이벤트 리스너를 messageForm에 추가해줄 것이다.
function handleSubmit(event) {
  event.preventDefault();
  // messageForm에서 받은 input값 불러오기
  const input = messageForm.querySelector('input')
  // console.log(input.value)

  // frontend의 form에서 backend로 무언가를 보내고 있다.
  socket.send(input.value)
  // send버튼 누르면 input.value 값 비워주기
  input.value = ''
}

messageForm.addEventListener('submit', handleSubmit)