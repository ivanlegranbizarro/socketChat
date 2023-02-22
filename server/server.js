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
    io.emit( 'rooms', rooms );
  } catch ( error ) {
    console.error( error.message );
  }

  socket.on( 'send-message', async ( data ) => {
    try {
      const token = socket.handshake.auth.token;
      const decoded = jwt.verify( token, process.env.JWT_SECRET );
      const user = decoded._id; // Renombramos la propiedad '_id' a 'id'
      const room = await Room.findOne( { name: data.room } );
      if ( room ) {
        room.messages.push( {
          user,
          message: data.message,
        } );
        await room.save();
        io.emit( 'response-from-server', {
          room: room.name, // Enviamos el nombre de la sala junto con los mensajes
          messages: room.messages,
        } );
      } else {
        console.error( `Room ${ data.room } not found.` );
      }
    } catch ( error ) {
      console.error( error.message );
    }
  } );

  socket.on( 'createRoom', async ( roomName ) => {
    try {
      const room = new Room( { name: roomName } );
      await room.save();
      console.log( `Room "${ roomName }" created.` );

      // Emitir las salas disponibles a todos los clientes conectados
      const rooms = await Room.find();
      io.emit( 'rooms', rooms );
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
