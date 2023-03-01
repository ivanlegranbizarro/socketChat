import { set, connect } from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();


set( 'strictQuery', false );

const conexion = async () => {
  try {
    await connect( `${ process.env.MONGO_URI }` );
    console.log( 'Conectado a la base de datos' );
  } catch ( error ) {
    console.log( error );
    throw new Error( 'No hemos podido conectarnos a tu base de datos' );
  }
};



export default conexion;
