import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import userRoutes from './routes/userRoutes.js';
import notFoundRoutes from './routes/NotFound.js';
import conexion from './db/conexion.js';
import cors from 'cors';
import Room from './models/roomModel.js';
import User from './models/userModel.js';
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

  // Broadcast when a user connects
  socket.broadcast.emit( 'message', 'A user has joined the chat' );

  // Broadcast when a user disconnects
  socket.on( 'disconnect', () => {
    io.emit( 'message', 'A user has left the chat' );
  } );
} );



// conectar a la base de datos
conexion();

httpServer.listen( port, () => {
  console.log( ` Server is running in http:;//localhost:${ port }` );
} );
