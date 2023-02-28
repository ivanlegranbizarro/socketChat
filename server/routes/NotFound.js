import express from 'express';

const router = express.Router();

router.get( '*', ( req, res ) => {
  res.status( 404 ).json( { message: 'Not Found' } ); //TODO - Crear controlador para manejar errores
} );


export default router;
