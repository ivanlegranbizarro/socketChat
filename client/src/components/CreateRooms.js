import React, { useState } from 'react';
import { TextField, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import { Button } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { io } from 'socket.io-client';

const FormContainer = styled( Box )( {
  backgroundColor: '#fff',
  borderRadius: '10px',
  boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
  padding: '10px',
  width: '50%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: '50px',
} );

const FormTitle = styled( Typography )( {
  marginBottom: '20px',
} );

const FormInput = styled( TextField )( {
  width: '100%',
  marginBottom: '20px',
} );

const FormButton = styled( Button )( {
  backgroundColor: '#1976d2',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#1e88e5',
  },
} );

function CreateRooms () {
  const [ socket, setSocket ] = useState( null );
  const [ roomName, setRoomName ] = useState( '' );

  React.useEffect( () => {
    const newSocket = io( 'http://localhost:4000' );
    setSocket( newSocket );
    return () => {
      newSocket.disconnect();
    };
  }, [] );


  const handleForm = ( e ) => {
    e.preventDefault();
    if ( socket ) {
      socket.emit( 'createRoom', roomName );
    }
    setRoomName( '' );
  };


  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <FormContainer>
        <FormTitle variant="h5">Create a new room</FormTitle>
        <form onSubmit={handleForm}>
          <FormInput
            label="Room name"
            variant="outlined"
            value={roomName}
            onChange={( e ) => setRoomName( e.target.value )}
          />
          <FormButton variant="contained" endIcon={<SendIcon />} type="submit">
            Create
          </FormButton>
        </form>
      </FormContainer>
    </Box>
  );
}

export default CreateRooms;
