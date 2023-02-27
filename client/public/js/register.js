const registerForm = document.getElementById( 'register-form' );
const displayErrors = document.getElementById( 'display-errors' );
const roomSelect = document.getElementById( 'room' );

// Connect to socket.io server and get the list of channels
const socket = io( 'http://localhost:4000' );

socket.on( 'channelList', ( channels ) => {
  roomSelect.innerHTML = ''; // clear the select options
  channels.forEach( ( channel ) => {
    const option = document.createElement( 'option' );
    option.value = channel.name;
    option.text = channel.name;
    roomSelect.add( option );
  } );
  // Add the option for creating a new room
  const newRoomOption = document.createElement( 'option' );
  newRoomOption.value = 'new-room';
  newRoomOption.text = 'Create new room...';
  roomSelect.add( newRoomOption );
} );

registerForm.addEventListener( 'submit', ( e ) => {
  e.preventDefault();

  const username = document.getElementById( 'username' ).value;
  const email = document.getElementById( 'email' ).value;
  const password = document.getElementById( 'password' ).value;
  const passwordConfirmation = document.getElementById( 'password-confirm' ).value;
  const room = document.getElementById( 'room' ).value;

  // Perform client-side validation
  if ( !username || !email || !password || !passwordConfirmation ) {
    displayErrors.innerHTML = `<div class="text-danger mb-4">Please fill in all fields</div>`;
    return;
  }

  if ( password !== passwordConfirmation ) {
    displayErrors.innerHTML = `<div class="text-danger mb-4">Passwords do not match</div>`;
    return;
  }

  // Send the registration data to the server
  fetch( 'http://localhost:4000/api/users/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify( { username, email, password, passwordConfirmation } ),
  } )
    .then( ( response ) => {
      console.log( response );
      return response.json();
    } )
    .then( ( data ) => {
      console.log( data );
      if ( data.success ) {
        localStorage.setItem( 'token', data.data.token );
        localStorage.setItem( 'username', username );
        window.location.href = `chat.html?username=${ username }&room=${ room }`;
      } else {
        displayErrors.innerHTML = `<div class="text-danger mb-4">${ data.message }</div>`;
      }
    } )
    .catch( ( error ) => console.log( error ) );
} );

// Add event listener to clear error message when user starts typing in a field
registerForm.addEventListener( 'input', () => {
  displayErrors.innerHTML = '';
} );

// Add listener to the room select to detect when the "Create new room..." option is selected
roomSelect.addEventListener( 'change', ( e ) => {
  if ( e.target.value === 'new-room' ) {
    const newRoomName = prompt( 'Enter the name of the new room' );
    if ( newRoomName ) {
      // Send the new room name to the server to create it
      socket.emit( 'joinRoom', { username: localStorage.getItem( 'username' ), room: newRoomName } );
      // Set the selected room to the new room
      roomSelect.value = newRoomName;
    }
  }
} );
