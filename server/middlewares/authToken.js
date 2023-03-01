import jwt from 'jsonwebtoken';

const authToken = ( socket, next ) => {
  if ( socket.handshake.auth.token ) {
    jwt.verify( socket.handshake.auth.token, process.env.JWT_SECRET, ( err ) => {
      if ( err ) {
        socket.emit( 'invalidToken' );
      }
      next();
    } );
  }
};

export default authToken;
