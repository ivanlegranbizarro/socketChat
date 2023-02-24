import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import userRoutes from './routes/userRoutes.js';
import notFoundRoutes from './routes/NotFound.js';
import conexion from './db/conexion.js';
import cors from 'cors';
import formatMessage from './helpers/messages.js';
import { userJoin, getCurrentUser, userLeave, getRoomUsers } from './helpers/users.js';
import Room from './models/roomModel.js';
import jwt from 'jsonwebtoken';


const app = express();

// middlewares
app.use( express.json() );
app.use( cors( { origin: [ 'http://localhost:3000' ] } ) );

// routes
app.use( '/api/users', userRoutes );
app.use( notFoundRoutes );

const port = process.env.PORT || 4000;

const httpServer = http.createServer( app );
const io = new Server( httpServer, {
  cors: {
    origin: [ 'http://localhost:3000' ],
  },
} );

const botName = 'ChatCord Bot';

io.on( 'connection', async ( socket ) => {
  const { token, username } = socket.handshake.auth;

  socket.on( 'joinRoom', async ( { username, room } ) => {
    const user = userJoin( socket.id, username, room );
    socket.join( user.room );

    // Create a new room if it doesn't exist
    let roomObject = await Room.findOne( { name: user.room } );
    if ( !roomObject ) {
      roomObject = new Room( { name: user.room, messages: [] } );
      await roomObject.save();
    }

    // Welcome current user
    socket.emit( 'message', formatMessage( botName, 'Welcome to ChatCord!' ) );

    // Broadcast when a user connects
    socket.broadcast.to( user.room ).emit( 'message', formatMessage( botName, `
    ${ user.username } has joined the chat` ) );

    // Send users and room info
    io.to( user.room ).emit( 'roomUsers', {
      room: user.room,
      users: getRoomUsers( user.room ),
    } );
  } );


  // Listen for chatMessage
  socket.on( 'chatMessage', async ( msg ) => {
    const user = await getCurrentUser( socket.id );

    // Find the room for the current user
    const roomObject = await Room.findOne( { name: user.room } );

    // Add the message to the room's messages array
    const messageObject = {
      user: user._id,
      message: msg
    };
    roomObject.messages.push( messageObject );
    await roomObject.save();

    io.to( user.room ).emit( 'message', formatMessage( user.username, msg ) );
  } );
  // Broadcast when a user disconnects
  socket.on( 'disconnect', async () => {
    const user = userLeave( socket.id );
    if ( user ) {
      io.to( user.room ).emit( 'message', formatMessage( botName, ` ${ user.username } has left the chat` ) );
      // Send users and room info
      io.to( user.room ).emit( 'roomUsers', {
        room: user.room,
        users: getRoomUsers( user.room ),
      } );

      // Remove the room from the database if there are no users left in it
      const roomUsers = await getRoomUsers( user.room );
      if ( roomUsers.length === 0 ) {
        await Room.findOneAndDelete( { name: user.room } );
      }
    }

  } );
} );

// connect to db
conexion();

httpServer.listen( port, () => {
  console.log( `Server is running in http://localhost:${ port }` );
} );
