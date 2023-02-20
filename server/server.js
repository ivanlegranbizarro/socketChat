import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

app = express();

const httpServer = http.createServer( app );
const io = new Server( httpServer );

const port = process.env.PORT || 4000;

io.on( 'connection', ( socket ) => {
  console.log( 'a user connected' );
} );



app.listen( port, () => {
  console.log( `Server is running in http://localhost:${ port }` );
} );
