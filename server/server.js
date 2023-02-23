import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import userRoutes from './routes/userRoutes.js';
import notFoundRoutes from './routes/NotFound.js';
import conexion from './db/conexion.js';
import cors from 'cors';
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

io.on( 'connection', async ( socket ) => {
  try {
    const rooms = await Room.find();
    socket.emit( 'rooms', rooms );
  } catch ( error ) {
    console.error( error.message );
  }

  socket.on( 'join-room', async ( roomName, callback ) => {
    try {
      const token = socket.handshake.auth.token;
      const decoded = jwt.verify( token, process.env.JWT_SECRET );
      const user = decoded.user;

      // Find or create the room with the given name
      let room = await Room.findOne( { name: roomName } );
      if ( !room ) {
        room = new Room( { name: roomName } );
        await room.save();
      }

      // Join the user to the room
      socket.join( room._id, );

      // Send the room data to the user
      callback( room );

      console.log( `User "${ user.username }" joined room "${ roomName }"` );
    } catch ( error ) {
      console.error( error.message );
    }
  } );

  socket.on( 'send-message', async ( data ) => {
    try {
      const token = socket.handshake.auth.token;
      const decoded = jwt.verify( token, process.env.JWT_SECRET );
      const user = decoded.user;

      const room = await Room.findOne( { name: data.room } );
      if ( room ) {
        room.messages.push( {
          user,
          message: data.message,
        } );
        await room.save();
        console.log( `Message sent to room ${ data.room }` );

        // Emit the message to all clients in the same room
        io.to( room._id ).emit( 'send-message', {
          message: data.message,
          isCurrentUser: false,
          user
        } );
      } else {
        console.error( `Room ${ data.room } not found.` );
      }
    } catch ( error ) {
      console.error( error.message );
    }
  } );

  socket.on( 'disconnect', () => {
    console.log( 'user disconnected' );
  } );
} );

// connect to database
conexion();

httpServer.listen( port, () => {
  console.log( `Server is running in http://localhost:${ port }` );
} );
