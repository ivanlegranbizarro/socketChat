import { Server } from 'socket.io';
import formatMessage from '../helpers/messages.js';
import { userJoin, getCurrentUser, userLeave, getRoomUsers } from '../helpers/users.js';
import Room from '../models/roomModel.js';

const botName = 'SocketChat Bot';

// Socket.io server
async function socketMain ( httpServer ) {
  const io = new Server( httpServer, {
    cors: {
      origin: [ 'http://localhost:3000' ],
    },
  } );

  // Run when client connects
  io.on( 'connection', async ( socket ) => {
    if ( !socket.handshake.auth.token ) {
      return socket.disconnect( true );
    }

    // Send channel list to the client
    const channels = await Room.find( {}, 'name' );
    socket.emit( 'channelList', channels );


    socket.on( 'joinRoom', async ( { username, room } ) => {
      const user = userJoin( socket.id, username, room );
      socket.join( user.room );

      // Create a new room if it doesn't exist
      let roomObject = await Room.findOne( { name: user.room } );
      if ( !roomObject ) {
        roomObject = new Room( { name: user.room, messages: [] } );
        await roomObject.save();
        channels.push( { name: roomObject.name } );
        io.emit( 'channelList', channels );
      }

      // Welcome current user
      socket.emit( 'message', formatMessage( botName, 'Welcome to SocketChat!' ) );

      // Get last 20 messages from the database and format them
      const messages = roomObject.messages.slice( -20 ).map( msg => formatMessage( msg.name, msg.message, msg.timestamp ) );

      // Send the last 20 messages to the client
      socket.emit( 'roomMessages', messages );

      // Broadcast when a user connects
      socket.broadcast.to( user.room ).emit( 'message', formatMessage( botName, `
      ${ user.username } has joined the chat` ) );

      // Send users info
      io.to( user.room ).emit( 'roomUsers', {
        users: getRoomUsers( user.room ),
      } );
    } );

    // Listen for createRoom event
    socket.on( 'createRoom', async ( newRoomName, callback ) => {
      try {
        // Check if the room already exists
        const existingRoom = await Room.findOne( { name: newRoomName } );
        if ( existingRoom ) {
          callback( { success: false, error: 'The room already exists' } );
          return;
        }

        // Create a new room
        const newRoom = new Room( { name: newRoomName, messages: [] } );
        await newRoom.save();

        // Send success response to client
        callback( { success: true } );

        // Update the list of channels for all clients
        const channels = await Room.find( {}, 'name' );
        io.emit( 'channelList', channels );
      } catch ( err ) {
        console.error( err );
        callback( { success: false, error: 'An error occurred while creating the room' } );
      }
    } );


    // Listen for chatMessage

    socket.on( 'chatMessage', async ( msg ) => {
      const user = await getCurrentUser( socket.id );

      // Find the room for the current user
      const roomObject = await Room.findOne( { name: user.room } );

      // Add the message to the room's messages array
      const messageObject = {
        user: user._id,
        name: user.username,
        message: msg,
      };

      roomObject.messages.push( messageObject );
      await roomObject.save();


      io.to( user.room ).emit( 'message', formatMessage( user.username, msg ) );
    } );

    // Listen for leaveRoom event
    socket.on( 'leaveRoom', async () => {
      const user = userLeave( socket.id );
      if ( user ) {
        socket.leave( user.room );
        // Send users and room info
        io.to( user.room ).emit( 'roomUsers', {
          users: getRoomUsers( user.room ),
        } );
        // Broadcast message to other users
        socket.broadcast.to( user.room ).emit( 'message', formatMessage( botName, `${ user.username } has left the room` ) );
      }
    } );


    // Broadcast when a user disconnects
    socket.on( 'disconnect', async () => {
      const user = userLeave( socket.id );
      if ( user ) {
        io.to( user.room ).emit( 'message', formatMessage( botName, ` ${ user.username } has left the chat` ) );
        // Send users and room info
        io.to( user.room ).emit( 'roomUsers', {
          users: getRoomUsers( user.room ),
        } );
      }
    } );
  } );
}

export default socketMain;

