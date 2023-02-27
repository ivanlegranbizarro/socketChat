import { Server } from 'socket.io';
import formatMessage from '../helpers/messages.js';
import { userJoin, getCurrentUser, userLeave, getRoomUsers } from '../helpers/users.js';
import Room from '../models/roomModel.js';

const botName = 'SocketChat Bot';

async function socketMain ( httpServer ) {
  const io = new Server( httpServer, {
    cors: {
      origin: [ 'http://localhost:3000' ],
    },
  } );

  // Default chat rooms
  const defaultRooms = [ 'Literatura', 'Programación' ];

  defaultRooms.forEach( async ( roomName ) => {
    let roomObject = await Room.findOne( { name: roomName } );
    if ( !roomObject ) {
      roomObject = new Room( { name: roomName, messages: [] } );
      await roomObject.save();
      io.emit( 'newRoom', { name: roomName } );
    }
  } );

  // Run when client connects
  io.on( 'connection', async ( socket ) => {
    const { name } = socket.handshake.auth;

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

    let counter = 0;
    let temporaryMessages = [];

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
      temporaryMessages.push( messageObject );

      counter += 1;
      if ( counter === 5 ) {
        counter = 0;
        roomObject.messages.push( ...temporaryMessages );
        await roomObject.save();
      }

      io.to( user.room ).emit( 'message', formatMessage( name, msg ) );
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

