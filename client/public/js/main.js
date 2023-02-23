const chatForm = document.getElementById( 'chat-form' );
const chatMessages = document.querySelector( '.chat-messages' );

socket = io.connect( 'http://localhost:4000' );
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
  div.innerHTML = ` <p>Brad <span>9:12pm</span></p>
  <p class="text">
    ${ message }
  </p> `;
  document.querySelector( '.chat-messages' ).appendChild( div );
};

