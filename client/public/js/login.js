const loginForm = document.getElementById( 'login-form' );
const displayErrors = document.getElementById( 'display-errors' );

loginForm.addEventListener( 'submit', e => {
  e.preventDefault();

  const username = document.getElementById( 'username' ).value;
  const password = document.getElementById( 'password' ).value;
  const room = document.getElementById( 'room' ).value;

  fetch( 'http://localhost:4000/api/users/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify( { username, password } )
  } )
    .then( response => {
      console.log( response );
      return response.json();
    } )
    .then( data => {
      console.log( data );
      if ( data.success ) {
        localStorage.setItem( 'token', data.data.token );
        localStorage.setItem( 'username', username );
        if ( room == '' ) {
          window.location.href = `chat.html?username=${ username }&room=socketChat`;
        } else {
          window.location.href = `chat.html?username=${ username }&room=${ room }`;
        }
      } else {
        displayErrors.innerHTML = `<div class="text-danger mb-4">${ data.message }</div>`;
      }

    } )
    .catch( error => console.log( error ) );
} );

// Add event listener to clear error message when user starts typing in a field
loginForm.addEventListener( 'input', () => {
  displayErrors.innerHTML = '';
} );
