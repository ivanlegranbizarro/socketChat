const registerForm = document.getElementById( "register-form" );
const displayErrors = document.getElementById( "display-errors" );

registerForm.addEventListener( "submit", ( e ) => {
  e.preventDefault();

  const username = document.getElementById( "username" ).value;
  const email = document.getElementById( "email" ).value;
  const password = document.getElementById( "password" ).value;
  const passwordConfirmation = document.getElementById( "passwordConfirmation" ).value;
  const room = document.getElementById( "room" ).value;

  // Perform client-side validation
  if ( !username || !email || !password || !passwordConfirmation) {
    displayErrors.innerHTML = `<div class="text-danger mb-4">Please fill in all fields</div>`;
    return;
  }

  if ( password !== passwordConfirmation ) {
    displayErrors.innerHTML = `<div class="text-danger mb-4">Passwords do not match</div>`;
    return;
  }

  // Send the registration data to the server
  fetch( "http://localhost:4000/api/users/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify( { username, email, password, passwordConfirmation } ),
  } )
    .then( ( response ) => {
      return response.json();
    } )
    .then( ( data ) => {
      if ( data.success ) {
        localStorage.setItem( "token", data.data.token );
        localStorage.setItem( "username", username );
        if ( room == '' ) {
          window.location.href = `chat.html?username=${ username }&room=socketChat`;
        } else {
          window.location.href = `chat.html?username=${ username }&room=${ room }`;
        }
      } else {
        displayErrors.innerHTML = `<div class="text-danger mb-4">${ data.message }</div>`;
      }
    } )
    .catch( ( error ) => alert( error ) );
} );

// Add event listener to clear error message when user starts typing in a field
registerForm.addEventListener( "input", () => {
  displayErrors.innerHTML = "";
} );


