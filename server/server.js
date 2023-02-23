import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import userRoutes from './routes/userRoutes.js';
import notFoundRoutes from './routes/NotFound.js';
import conexion from './db/conexion.js';
import cors from 'cors';
import formatMessage from './helpers/messages.js';
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

const botName = 'ChatCord Bot';

io.on( 'connection', async ( socket ) => {
  // Welcome current user
  socket.emit( 'message', formatMessage( botName, 'Welcome to ChatCord!' ) );

  // Broadcast when a user connects
  socket.broadcast.emit( 'message', formatMessage( botName, 'A user has joined the chat' ) );

  // Broadcast when a user disconnects
  socket.on( 'disconnect', () => {
    io.emit( 'message', formatMessage( botName, 'A user has left the chat' ) );
  } );

  // Listen for chatMessage
  socket.on( 'chatMessage', async ( msg ) => {
    io.emit( 'message', formatMessage( 'USER', msg ) );
  } );
} );



// connect to db
conexion();

httpServer.listen( port, () => {
  console.log( ` Server is running in http:;//localhost:${ port }` );
} );
