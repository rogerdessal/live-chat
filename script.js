const socket = io('http://localhost:3000')
const messageContainer = document.getElementById('message-container')
const messageForm = document.getElementById('send-container')
const usernameContainer = document.getElementById('username-container')
const userForm = document.getElementById('user-form-container')
const messageInput = document.getElementById('message-input')
const userInput = document.getElementById('user-input')
const activeUsersElement = document.getElementById('activeUsersContainer')
const chatMainContainer = document.getElementById('chat-main-container')

socket.on('chat-message', data => {
  appendMessage(data)
})

socket.on('user-connected', user => {
  appendConnection(`${user.name} has joined the chat`, true)
  appendActiveUser(user.name, user.id)
})
socket.on('initialize-members', users => {
  for (let key of Object.keys(users)) {
    appendActiveUser(users[key], key)
  }
})

socket.on('user-disconnected', user => {
  appendConnection(`${user.name} has left the chat`, false)
  removeFromMembers(user.id)
})

messageForm.addEventListener('submit', e => {
  e.preventDefault()
  const message = messageInput.value
  appendMyMessage(message)
  socket.emit('send-chat-message', message)
  messageInput.value = ''
})

userForm.addEventListener('submit', e => {
  e.preventDefault()
  const username = userInput.value;
  chatMainContainer.classList.remove("d-none");
  usernameContainer.classList.add("d-none");

  socket.emit('new-user', username)
  appendConnection(`You have joined the chat`, true)

})

function appendMessage(user) {
  const messageElement = document.createElement('div')
  messageElement.innerHTML = `
  <li class="clearfix mt-2">
  <div class="message-data text-right">
  <img src="https://www.bootdey.com/img/Content/avatar/avatar3.png" alt="avatar">
  <div class="d-flex flex-column">
  <span class="message-data-user ms-2">${user.name}</span>
  <span class="message-data-time">${new Date().toLocaleTimeString()}</span>
  </div>
  </div>
  <div class="message my-message">
  ${user.message}
  </div>
  </li>`
  messageContainer.append(messageElement)
}



function appendMyMessage(message) {
  const messageElement = document.createElement('div')
  messageElement.innerHTML = `
  <li class="clearfix mt-2">
  <div class="message-data text-left justify-content-end">
  <div class="d-flex flex-column">
  <span class="message-data-user">You</span>
  <span class="message-data-time">${new Date().toLocaleTimeString()}</span>
  </div>
    <img src="https://bootdey.com/img/Content/avatar/avatar7.png" alt="avatar">
  </div>
  <div class="message other-message float-right">
   ${message} 
   </div>
</li>`
  messageContainer.append(messageElement)
}

function appendConnection(text, userConnected = true) {
  const messageElement = document.createElement('div')
  messageElement.innerHTML = `
  <div class="connection-message alert ${userConnected ? 'alert-success' : 'alert-danger'}" role="alert">
    ${text}
  </div>`
  messageContainer.append(messageElement)
}

function appendActiveUser(name, id) {
  const user = document.createElement('div')

  user.innerHTML = `
  <li id=${id} class="clearfix">
  <img src="https://bootdey.com/img/Content/avatar/avatar2.png" alt="avatar">
  <div class="about">
    <div class="name">${name}</div>
    <div class="status"> <i class="fa fa-circle online"></i> online </div>
  </div>
</li>`
  activeUsersElement.append(user)
}

function removeFromMembers(id) {
  const member = document.getElementById(id);
  if (member) {
    member.remove()
  }

}