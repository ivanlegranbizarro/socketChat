import express from 'express';
import http from 'http';
import { Server } from 'socket.io';


const app = express();


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



httpServer.listen( port, () => {
  console.log( `Server is running in http://localhost:${ port }` );
} );
