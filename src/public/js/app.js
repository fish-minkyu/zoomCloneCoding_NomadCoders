// front

// 새로고침을 할 때 이것이 작동한다.
// 그러면 모든 addEventListener가 설정된다.
const socket = new WebSocket(`ws://${window.location.host}`); // window.location.host == http://localhost:3000

// socket이 connection을 open 했을 때 발생한다.
socket.addEventListener('open', () => {
  console.log('connected to Server ✅')
});

// message 이벤트가 발생했을 때
socket.addEventListener('message', (message) => {
  console.log('New message:', message.data)
});

// close 이벤트가 발생했을 때
socket.addEventListener('close', () => {
  console.log('Disconnected from Server ❌')
});

// frontend에서 backend로 메시지 보내기
// 바로 보내는 것을 원치 않으므로 setTimeout으로 감싸준다.
setTimeout(() => {
  socket.send('hello from the browser')
}, 10000);