import React from 'react';
import Button from '@mui/material/Button';
import { io } from 'socket.io-client';

function App () {
  React.useEffect( () => {
    const socket = io( 'http://localhost:4000' );
    socket.on( 'connect', () => {
      console.log( 'Connected to server' );
    } );
    socket.on( 'disconnect', () => {
      console.log( 'Disconnected from server' );
    } );
  }, [] );

  return (
    <div>
      Hello socket
      <Button variant='text'>Text</Button>
    </div>
  );
}

export default App;
