// front

// 우리가 어디에 있는지 알려주는 코드
// socket 사용 시, http 프로토콜은 사용할 수 없다.
// 여기 frontend에서 backend로 메시지를 보낼 수 있다.
// 그리고 backend로부터 메시지를 받을 수 있다.
// 여기서의 socket은 서버로의 연결을 뜻한다.
const socket = new WebSocket(`ws://${window.location.host}`) // window.location.host == http://localhost:3000
