import React from 'react';
import { io } from 'socket.io-client';
import ChatWindow from './components/ChatWindow';

function App () {
  const [ socket, setSocket ] = React.useState( null );

  React.useEffect( () => {
    setSocket( io( 'http://localhost:4000' ) );
  }, [] );

  return (
    <div>
      {socket ? <ChatWindow socket={socket} /> : 'Connecting to server...'}
    </div>
  );
};

export default App;
