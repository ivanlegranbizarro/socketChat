import express from 'express';

const router = express.Router();

router.get( '*', ( req, res ) => {
  res.status( 404 ).json( { message: 'Not Found' } );
} );


export default router;