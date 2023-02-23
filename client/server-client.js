import express from 'express';
import { createServer } from 'http';

const app = express();
const server = createServer( app );

app.get( '/', ( req, res ) => {
  res.sendFile( 'login.html', { root: "./" } );
} );

app.get( '/chat', ( req, res ) => {
  res.sendFile( 'index.html', { root: "./" } );
} );

app.get( '/room/:name', ( req, res ) => {
  res.sendFile('room.html', { root: "./" } );
} );

app.get('/register', (req, res) => {
  res.sendFile('register.html', { root: "./" });
});

app.get('/logout', (req, res) => {
  res.sendFile('login.html', { root: "./" });
});

app.get('*', (req, res) => {
  res.sendFile('NotFound.html', { root: "./" });
});




server.listen( 3000, () => {
  console.log( 'listening on *:3000' );
} );
