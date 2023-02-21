import React, { useState } from 'react';
import { TextField, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import { io } from 'socket.io-client';
import { Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import SendIcon from '@mui/icons-material/Send';
import Card from '@mui/material/Card';

const ChatContainer = styled( Box )( {
  backgroundColor: '#fff',
  borderRadius: '10px',
  boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
  padding: '10px',
  height: '80vh',
  overflow: 'scroll',
  '&::-webkit-scrollbar': {
    width: '6px'
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: '#1976d2'
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: '#fff'
  },
  marginRight: '20px',
  width: '65%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: '50px',
} );

const MessageInput = styled( TextField )( {
  width: '100%',
  marginTop: '10px'
} );

const ChatButton = styled( Button )( {
  marginTop: '20px',
  marginBottom: '10px',
  backgroundColor: '#1976d2',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#1e88e5'
  }
} );

const FormContainer = styled( Box )( {
  width: '35%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: '50px',
} );

function ChatWindow () {
  const [ socket, setSocket ] = useState( null );
  const [ message, setMessage ] = useState( '' );
  const [ chat, setChat ] = useState( [] );
  const [ isTyping, setIsTyping ] = useState( false );
  const [ error, setError ] = useState( false );

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
    if ( !socket ) return;
    socket.on( 'response-from-server', ( data ) => {
      setChat( ( prev ) => [ ...prev, data.message ] );
    } );

    socket.on( 'typing-start', () => {
      setIsTyping( true );
    } );

    socket.on( 'typing-stop', () => {
      setIsTyping( false );
    } );
  }, [ socket ] );

  const handleForm = ( e ) => {
    e.preventDefault();
    if ( message.length > 0 ) {
      socket.emit( 'send-message', { message } );
      setMessage( '' );
      setError( false );
    } else {
      setError( true );
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <ChatContainer>
        {chat.map( ( message, index ) => (
          <Card
            sx={{
              width: '50%',
              padding: '10px',
              marginBottom: '10px',
              backgroundColor: '#1976d2',
              color: '#fff',
            }}
            key={index}
          >
            <Typography variant="body1">{message}</Typography>
          </Card>
        ) )}
        {isTyping && (
          <Typography variant="body1" sx={{ color: '#1976d2' }}>
            Someone is typing...
          </Typography>
        )}
      </ChatContainer>
      <FormContainer>
        <Typography variant="h5">Send a message</Typography>
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
            onClick={handleForm}
          >
            Send
          </ChatButton>
        </form>
      </FormContainer>
    </Box>
  );
}

export default ChatWindow;
