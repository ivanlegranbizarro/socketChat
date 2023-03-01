// Protecting the chat room from unauthorized users
const token = localStorage.getItem( 'token' );

if ( !token ) {
  window.location = '../index.html';
}

const chatForm = document.getElementById( 'chat-form' );
const chatMessages = document.querySelector( '.chat-messages' );
const roomName = document.getElementById( 'room-name' );
const userList = document.getElementById( 'users' );
const createRoomForm = document.getElementById( 'create-room-form' );
const roomList = document.getElementById( 'rooms' );

// Get username and room from URL
let { username, room } = Qs.parse( location.search, {
  ignoreQueryPrefix: true,
} );

let currentRoom = room;

socket = io.connect( 'http://localhost:4000', {
  auth: {
    token: localStorage.getItem( 'token' ),
  },
} );

// Join chatroom
socket.emit( 'joinRoom', { username, room } );

// Get room of users
socket.on( 'roomUsers', ( { users } ) => {
  outputUsers( users );
} );

// Get last 20 messages when joining a room
socket.on( 'roomMessages', ( messages ) => {
  messages.forEach( ( message ) => {
    outPutMessage( message );
  } );

  // Scroll down the chat
  chatMessages.scrollTop = chatMessages.scrollHeight;
} );

// Message from server
socket.on( 'message', ( message ) => {
  console.log( message );
  outPutMessage( message );

  // Scroll down the chat
  chatMessages.scrollTop = chatMessages.scrollHeight;
} );

// Message submit
chatForm.addEventListener( 'submit', ( e ) => {
  e.preventDefault();

  // Get message text
  const msg = e.target.elements.msg.value;

  // Emit message to server
  socket.emit( 'chatMessage', msg );

  // Clear input after submit
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
} );

// Output message to DOM
const outPutMessage = ( message ) => {
  const div = document.createElement( 'div' );
  div.classList.add( 'card', 'mb-2' );
  div.innerHTML = `
    <div class="card-body p-2 text-${ message.username === username ? 'start' : 'end' } ${ message.username === 'SocketChat Bot' ? 'text-center' : '' }" style="background-color: ${ message.username === username ? 'rgba(0, 123, 255, 0.4)' : message.username === 'SocketChat Bot' ? 'rgba(128, 128, 128, 0.4)' : 'rgba(40, 167, 69, 0.4)'
    };">
      <h5 class="card-title m-0 ${ message.username === username ? 'ms-4' : 'me-4' }">${ message.username } <small class="text-muted">${ message.time }</small></h5>
      <p class="card-text mb-0 ${ message.username === username ? 'ms-4' : 'me-4' }">${ message.text }</p>
    </div>
  `;
  chatMessages.appendChild( div );
};



//Prompt the user before leave chat room
document.getElementById( 'leave-btn' ).addEventListener( 'click', () => {
  const leaveChat = confirm( 'Are you sure you want to leave the chatroom?' );
  if ( leaveChat ) {
    window.location = '../index.html';
    localStorage.removeItem( 'token' );
  }
} );

// Load rooms from db
socket.on( 'channelList', ( rooms ) => {
  roomList.innerHTML = '';

  rooms.forEach( ( room ) => {
    const li = document.createElement( 'li' );
    const link = document.createElement( 'a' );
    link.addEventListener( 'click', () => {
      socket.emit( 'leaveRoom' );
    } );
    link.href = `chat.html?username=${ username }&room=${ room.name }`;
    link.innerText = room.name;
    link.classList.add( 'btn', 'btn-link', 'text-dark', 'room-link' );
    li.appendChild( link );
    roomList.appendChild( li );

    // Add active class to current room
    if ( room.name === currentRoom ) {
      link.classList.add( 'fw-bold' );
      link.classList.remove = 'text-dark';
      link.classList.add( 'text-success' );
    }
  } );
} );

// Create a new room
createRoomForm.addEventListener( 'submit', ( e ) => {
  e.preventDefault();

  const roomNameInput = document.getElementById( 'room-name-input' );
  const newRoomName = roomNameInput.value;

  // Emit new room to server
  socket.emit( 'createRoom', newRoomName, ( response ) => {
    if ( response.success ) {
      // Clear room name input
      roomNameInput.value = '';

      // Refresh room list
      socket.emit( 'getChannels' );
    } else {
      alert( response.error );
    }
  } );
} );

// Add users to DOM
const outputUsers = ( users ) => {
  userList.innerHTML = `
    ${ users.map( ( user ) => `<li class="${ user.username === username ? 'fw-bold' : '' }">${ user.username }</li>` ).join( '' ) }
  `;
};
