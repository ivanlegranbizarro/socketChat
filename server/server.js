import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import userRoutes from './routes/userRoutes.js';
import notFoundRoutes from './routes/NotFound.js';
import conexion from './db/conexion.js';
import cors from 'cors';
import Room from './models/roomModel.js';

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
  }
} );

io.on( 'connection', ( socket ) => {
  socket.on( 'send-message', ( data ) => {
    socket.emit( 'response-from-server', data );
  } );

  socket.on( 'typing-start', () => {
    socket.broadcast.emit( 'typing-start' );
  } );

  socket.on( 'typing-stop', () => {
    socket.broadcast.emit( 'typing-stop' );
  } );

  socket.on( 'createRoom', async ( roomName ) => {
    try {
      const room = new Room( { name: roomName } );
      await room.save();
      console.log( `Room "${ roomName }" created.` );
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
