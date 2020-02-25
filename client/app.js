const socket = io();
const loginForm = document.getElementById('welcome-form');
const messagesSection = document.getElementById('messages-section');
const messagesList = document.getElementById('messages-list');
const addMessageForm = document.getElementById('add-messages-form');
const userNameInput = document.getElementById('username');
const messageContentInput = document.getElementById('message-content');
const userId = socket.id;

let userName = '';

socket.on('message', ({ uid, author, content }) => addMessage(uid, author, content))

// login
function login(event) {
    event.preventDefault();
    console.log(socket.id);
    if (userNameInput.value == '') {
        alert('Write your name');
    } else {
        userName = userNameInput.value;
        socket.emit('join', userName);
        loginForm.classList.remove('show');
        messagesSection.classList.add('show');
    }
};

loginForm.addEventListener('submit', login);

// add message
function addMessage(uid, author, content) {
    const message = document.createElement('li');
    message.classList.add('message');
    message.classList.add('message--received');
    if (uid === socket.id) message.classList.add('message--self');
    message.innerHTML = `
      <h3 class="message__author">${uid === socket.id ? 'You' : author}</h3>
      <div class="message__content">
        ${content}
      </div>
    `;
    messagesList.appendChild(message);
}


// send message
function sendMessage(event) {
    event.preventDefault();

    let messageContent = messageContentInput.value;

    if (messageContentInput.value == '') {
        alert('Write your message');
    } else {
        console.log(userName, socket.id);
        addMessage(socket.id, userName, messageContent);
        socket.emit('message', { uid: socket.id, author: userName, content: messageContent })
        messageContentInput.value = '';
    }
}

addMessageForm.addEventListener('submit', sendMessage);