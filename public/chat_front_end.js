const chatForm  = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');


//get the username and the room from url
// const {username, room} = Qs.parse(location.search, {
//     ignoreQueryPrefix:true
// })
let room = ROOM_ID
let userName;
let buyerId;

    axios.post("/room",{roomId: ROOM_ID}).
        .then(response => {
            userName= responce.data.name
            buyerId = responce.data.buyerId
        })

console.log(username, room)


let room = ROOM_ID
let userName = 



const socket = io.connect();



// Join chatroom
socket.emit('joinRoom', { username, room });

// Get room and users
// socket.on('roomUsers', ({ room, users }) => {
//     outputRoomName(room);
//     outputUsers(users);
// });


//message from server
socket.on('message', message=>{
    console.log(message)
    outputMessage(message)

    // Scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
})


//message submit
chatForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    const msg = e.target.elements.msg.value

    //emitting the message in input to server side
    socket.emit('chatMessage', msg)

})


//output message from server
function outputMessage(message){
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta"> ${message.username} <span> ${message.time}</span></p>
                         <p class="text">
                            ${message.text}
                         </p>`;
    document.querySelector('.chat-messages').appendChild(div)
}



// Add room name to DOM
// function outputRoomName(room) {
//     roomName.innerText = room;
// }

// Add users to DOM
function outputUsers(users) {
    userList.innerHTML = '';
    users.forEach((user) => {
        const li = document.createElement('li');
        li.innerText = user.username;
        userList.appendChild(li);
    });
}


// user leave chat room
document.getElementById('leave-btn').addEventListener('click', () => {
    window.location = '../index.html';
});
