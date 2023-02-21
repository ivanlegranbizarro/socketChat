import React from 'react';
import { TextField, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import { io } from 'socket.io-client';
import { Button, Paper } from '@mui/material';
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
  marginRight: '20px',  // modificamos el margen derecho en lugar del izquierdo
  width: '65%',  // reducimos el ancho al 50%
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
  width: '35%',  // ocupamos el otro 50% del ancho
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: '50px',
} );

function ChatWindow () {
  const [ socket, setSocket ] = React.useState( null );
  const [ message, setMessage ] = React.useState( '' );
  const [ chat, setChat ] = React.useState( [] );
  const [ error, setError ] = React.useState( false );

  React.useEffect( () => {
    setSocket( io( 'http://localhost:4000' ) );
  }, [] );

  React.useEffect( () => {
    if ( !socket ) return;
    socket.on( 'response-from-server', ( data ) => {
      setChat( ( prev ) => [ ...prev, data.message ] );
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
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          {chat.map( ( message, index ) => (
            <Paper key={index} sx={{ padding: '10px', marginBottom: '10px' }}>
              <Typography variant='body1'>{message}</Typography>
            </Paper>
          ) )}
        </Box>
      </ChatContainer>
      <FormContainer>
        <Card sx={{ width: '100%', padding: '10px' }}>
          <Typography variant='h5'>Chat</Typography>
          <form onSubmit={handleForm}>
            <MessageInput
              label='Message'
              variant='outlined'
              value={message}
              onChange={( e ) => setMessage( e.target.value )}
              error={error}
              helperText={error && 'Please enter a message'}
            />
            <ChatButton
              variant='contained'
              endIcon={<SendIcon />}
              type='submit'
            >
              Send
            </ChatButton>
          </form>
        </Card>
      </FormContainer>
    </Box>
  );
}

export default ChatWindow;
