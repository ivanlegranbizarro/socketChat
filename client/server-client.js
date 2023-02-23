const express = require( 'express' );
const path = require( 'path' );

const app = express();

app.use( express.static( path.join( __dirname, 'public' ) ) );

// rendering NotFound.html page for all routes
app.get( '*', ( req, res ) => {
  res.sendFile( path.join( __dirname, 'public', 'NotFound.html' ) );
} );

const PORT = 3000 || process.env.PORT;


app.listen( PORT, () => {
  console.log( `Server is running on port ${ PORT }` );
} );
