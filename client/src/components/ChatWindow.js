import React, { useState } from 'react';
import { TextField, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { io } from 'socket.io-client';
import { styled } from '@mui/material/styles';
import { Button } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import Card from '@mui/material/Card';
import CreateRooms from './CreateRooms';

const ChatContainer = styled( Box )( {
  backgroundColor: '#fff',
  borderRadius: '10px',
  boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
  padding: '10px',
  height: '70vh',
  overflow: 'scroll',
  '&::-webkit-scrollbar': {
    width: '6px',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: '#1976d2',
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: '#fff',
  },
  marginLeft: '40px',
  marginTop: '48px',
} );

const MessageInput = styled( TextField )( {
  width: '100%',
  marginTop: '10px',
  marginLeft: '15px',
} );

const ChatButton = styled( Button )( {
  marginTop: '20px',
  marginBottom: '10px',
  backgroundColor: '#1976d2',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#1e88e5',
  },
  marginLeft: '15px',
} );
function ChatWindow () {
  const [ socket, setSocket ] = useState( null );
  const [ message, setMessage ] = useState( '' );
  const [ chat, setChat ] = useState( [] );
  const [ isTyping, setIsTyping ] = useState( false );
  const [ error, setError ] = useState( false );
  const [ selectedRoom, setSelectedRoom ] = useState( null ); // Variable de estado para la sala seleccionada

  let typingTimeout = null;

  const handleTypingStart = () => {
    if ( !isTyping ) {
      setIsTyping( true );
      socket.emit( 'typing-start' );
    }
  };

  const handleTypingStop = () => {
    if ( isTyping ) {
      setIsTyping( false );
      socket.emit( 'typing-stop' );
    }
  };

  const handleKeyUp = ( e ) => {
    clearTimeout( typingTimeout );
    typingTimeout = setTimeout( () => handleTypingStop(), 1000 );
    handleTypingStart();
  };

  const handleBlur = () => {
    clearTimeout( typingTimeout );
    handleTypingStop();
  };

  React.useEffect( () => {
    setSocket( io( 'http://localhost:4000' ) );
  }, [] );

  React.useEffect( () => {
    if ( !socket || !selectedRoom ) return; // Si no se ha seleccionado una sala, no se debe suscribir a los eventos de socket
    socket.emit( 'join-room', selectedRoom.name ); // Unirse a la sala
    socket.on( 'response-from-server', ( data ) => {
      setChat( ( prev ) => [ ...prev, data.message ] );
    } );

    socket.on( 'typing-start', () => {
      setIsTyping( true );
    } );

    socket.on( 'typing-stop', () => {
      setIsTyping( false );
    } );
  }, [ socket, selectedRoom ] );

  const handleForm = ( e ) => {
    e.preventDefault();
    if ( message.length > 0 ) {
      socket.emit( 'send-message', { message, room: selectedRoom.name } ); // Enviar el mensaje a la sala seleccionada
      setMessage( '' );
      setError( false );
    } else {
      setError( true );
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <ChatContainer>
            {chat.map( ( message, index ) => (
              <Card key={index} sx={{ marginBottom: '10px' }}>
                <Typography variant="body1">{message}</Typography>
              </Card>
            ) )}
            {isTyping && (
              <Typography variant="body1">Someone is typing...</Typography>
            )}
          </ChatContainer>
          <form onSubmit={handleForm}>
            <MessageInput
              label="Message"
              variant="outlined"
              value={message}
              onChange={( e ) => setMessage( e.target.value )}
              onKeyUp={handleKeyUp}
              onBlur={handleBlur}
              error={error}
              helperText={error && 'Please enter a message'}
            />
            <ChatButton
              variant="contained"
              endIcon={<SendIcon />}
              type="submit"
            >
              Send
            </ChatButton>
          </form>
        </Grid>
        <Grid item xs={12} md={6}>
          <CreateRooms
            socket={socket}
            selectedRoom={selectedRoom}
            setSelectedRoom={setSelectedRoom}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default ChatWindow;

