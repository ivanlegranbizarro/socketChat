import express from 'express';
import { createServer } from 'http';

const app = express();
const server = createServer( app );

app.get( '/', ( req, res ) => {
  res.sendFile( new URL( 'login.html', import.meta.url ).pathname );
} );

app.get( '/chat', ( req, res ) => {
  res.sendFile( new URL( 'index.html', import.meta.url ).pathname );
} );

app.get( '/register', ( req, res ) => {
  res.sendFile( new URL( 'register.html', import.meta.url ).pathname );
} );

app.get( '/logout', ( req, res ) => {
  res.sendFile( new URL( 'login.html', import.meta.url ).pathname );
} );

app.get( '*', ( req, res ) => {
  res.sendFile( new URL( 'NotFound.html', import.meta.url ).pathname );
} );



server.listen( 3000, () => {
  console.log( 'listening on *:3000' );
} );
