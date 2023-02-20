const mongoose = require( 'mongoose' );

mongoose.set( 'strictQuery', false );

const conexion = async () => {
  try {
    await mongoose.connect( 'mongodb://localhost:27017/chat' );
    console.log( 'Conectado a la base de datos' );
  } catch ( error ) {
    console.log( error );
    throw new Error( 'No hemos podido conectarnos a tu base de datos' );
  }
};


module.exports = {
  conexion
};
