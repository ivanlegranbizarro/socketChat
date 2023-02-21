import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import userRoutes from './routes/userRoutes.js';
import conexion from './db/conexion.js';

const app = express();

// middlewares
app.use( express.json() );

// routes
app.use( '/api/users', userRoutes );


const port = process.env.PORT || 4000;

const httpServer = http.createServer( app );
const io = new Server( httpServer, {
  cors: {
    origin: [ 'http://localhost:3000' ],
  }
} );




io.on( 'connection', ( socket ) => {
  console.log( 'a user connected' );
} );

// connect to database
conexion();

httpServer.listen( port, () => {
  console.log( `Server is running in http://localhost:${ port }` );
} );
