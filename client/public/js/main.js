const chatForm = document.getElementById( 'chat-form' );
const chatMessages = document.querySelector( '.chat-messages' );

// Get username and room from URL
const { username, room } = Qs.parse( location.search, {
  ignoreQueryPrefix: true,
} );


socket = io.connect( 'http://localhost:4000' );
// Join chatroom
socket.emit( 'joinRoom', { username, room } );

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
  div.classList.add( 'message' );
  div.innerHTML = ` <p>${ message.username } <span>${ message.time }</span></p>
  <p class="text">
    ${ message.text }
  </p> `;
  document.querySelector( '.chat-messages' ).appendChild( div );
};

//Prompt the user before leave chat room
document.getElementById( 'leave-btn' ).addEventListener( 'click', () => {
  const leaveRoom = confirm( 'Are you sure you want to leave the chatroom?' );
  if ( leaveRoom ) {
    window.location = '../index.html';
  } else {
  }
} );

