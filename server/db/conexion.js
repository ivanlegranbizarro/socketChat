import { set, connect } from 'mongoose';

set( 'strictQuery', false );

const conexion = async () => {
  try {
    await connect( 'mongodb://localhost:27017/socketChat' );
    console.log( 'Conectado a la base de datos' );
  } catch ( error ) {
    console.log( error );
    throw new Error( 'No hemos podido conectarnos a tu base de datos' );
  }
};



export default conexion;
