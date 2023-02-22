import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import { Box, Card, CardContent, Typography } from '@mui/material';
import { io } from 'socket.io-client';

const ListContainer = styled( Box )( {
  marginTop: '50px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
} );

const RoomCard = styled( Card )( {
  width: '50%',
  margin: '10px',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: '#f5f5f5',
  },
} );

function RoomList () {
  const [ socket, setSocket ] = useState( null );
  const [ rooms, setRooms ] = useState( [] );

  useEffect( () => {
    const newSocket = io( 'http://localhost:4000' );
    setSocket( newSocket );

    newSocket.on( 'roomCreated', ( room ) => {
      setRooms( ( prevRooms ) => [ ...prevRooms, room ] );
    } );

    newSocket.emit( 'getRooms' );

    newSocket.on( 'rooms', ( data ) => {
      setRooms( data );
    } );

    return () => {
      newSocket.disconnect();
    };
  }, [] );

  const handleRoomClick = ( roomName ) => {
    console.log( `Joining room ${ roomName }` );
    // Aquí se debería enviar el usuario a la sala correspondiente
  };

  return (
    <ListContainer>
      {rooms.map( ( room ) => (
        <RoomCard key={room.id} onClick={() => handleRoomClick( room.name )}>
          <CardContent>
            <Typography variant="h6">{room.name}</Typography>
            <Typography variant="body1">{room.description}</Typography>
          </CardContent>
        </RoomCard>
      ) )}
    </ListContainer>
  );
}

export default RoomList;