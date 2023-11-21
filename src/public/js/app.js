// front

const messageList = document.querySelector('ul')
const nicknameForm = document.querySelector('#nick')
const messageForm = document.querySelector('#message')
const socket = new WebSocket(`ws://${window.location.host}`); // window.location.host == http://localhost:3000

//? 브라우저와 서버 연결
// socket이 connection을 open 했을 때 발생한다.
socket.addEventListener('open', () => {
  console.log('connected to Server ✅')
});

//? message 이벤트가 발생했을 때, 화면에 보여주기
// 새로운 메시지가 왔을 때, 그 string을 object로 만들어야 한다.
socket.addEventListener('message', (message) => {
  // 메시지 받으면 새로운 li 만들기
  const li = document.createElement('li')
  // message.data를 li 안에 넣기
  li.innerText = message.data
  // li를 messageList 안에 넣기
  messageList.append(li)
});

//? 닉네임 보내기
nicknameForm.addEventListener('submit', handleNickSubmit)

function handleNickSubmit(event) {
  event.preventDefault()
  // nicknameForm에서 입력값 가져오기
  const input = nicknameForm.querySelector('input')
  // socket.send()는 string만 보낼 수 있다.
  // 따라서 JSON 객체를 string으로 바꿔준다.
  // string으로 바뀐 object는 back-end로 전송이 된다.
  // 그리고 back-end에서는 그 string을 다시 object로 바꿔준다.
  
  socket.send(makeMessage('nickname', input.value)) 
};

//? 대화내용 보내기
messageForm.addEventListener('submit', handleSubmit);

// 이벤트 리스너를 messageForm에 추가해줄 것이다.
function handleSubmit(event) {
  event.preventDefault();
  // messageForm에서 받은 input값 불러오기
  const input = messageForm.querySelector('input')

  // frontend의 messageForm에서 backend로 메시지 보내기
  socket.send(makeMessage('new_message', input.value))
  // send버튼 누르면 input.value 값 비워주기
  input.value = ''
};

//? 브라우저와 서버의 연결이 끊겼을 때
socket.addEventListener('close', () => {
  console.log('Disconnected from Server ❌')
});

//? 메시지를 보낼 객체 만들기
// 메시지를 전송하고 싶으면 makeMessage 함수를 호출하면 된다.
function makeMessage(type, payload) {
  const msg = {type, payload}
  return JSON.stringify(msg)
};