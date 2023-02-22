import React, { useState } from 'react';
import { TextField, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import { Button, Card, CardContent } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { io } from 'socket.io-client';
import RoomList from './RoomList';

const FormContainer = styled( Box )( {
  backgroundColor: '#fff',
  borderRadius: '10px',
  boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
  padding: '10px',
  width: '100%',
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
  const [ roomNameError, setRoomNameError ] = useState( '' );

  React.useEffect( () => {
    const newSocket = io( 'http://localhost:4000' );
    setSocket( newSocket );
    return () => {
      newSocket.disconnect();
    };
  }, [] );

  const handleForm = ( e ) => {
    e.preventDefault();
    if ( roomName.length < 3 ) {
      setRoomNameError( 'Room name must have at least 3 characters.' );
      return;
    }
    if ( socket ) {
      socket.emit( 'createRoom', roomName );
    }
    setRoomName( '' );
    setRoomNameError( '' );
  };

  const handleInputFocus = () => {
    setRoomNameError( '' );
  };
  const handleRoomNameChange = ( e ) => {
    const value = e.target.value;
    setRoomName( value );
    if ( value.length === 0 ) {
      setRoomNameError( '' );
    } else if ( value.length < 3 || value.length > 10 ) {
      setRoomNameError( 'Room name must be between 3 and 10 characters' );
    } else {
      setRoomNameError( '' );
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box sx={{ width: '50%', mb: 3 }}>
        <FormContainer>
          <FormTitle variant="h5">Create a new room</FormTitle>
          <form onSubmit={handleForm}>
            <FormInput
              label="Room name"
              variant="outlined"
              value={roomName}
              onChange={handleRoomNameChange}
              onFocus={handleInputFocus}
              error={roomNameError.length > 0}
              helperText={roomNameError}
            />
            <FormButton variant="contained" type="submit" endIcon={<SendIcon />}>
              Create
            </FormButton>
          </form>
        </FormContainer>
      </Box>
      <Box sx={{ width: '50%', maxWidth: 500 }}>
        <Card>
          <CardContent>
            <Typography variant="h5" sx={{ mb: 2 }}>Available rooms:</Typography>
            <RoomList />
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}

export default CreateRooms;
