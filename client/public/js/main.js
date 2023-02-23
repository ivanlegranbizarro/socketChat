socket = io.connect( 'http://localhost:4000' );

socket.on( 'message', ( message ) => {
  console.log( message );
} );
