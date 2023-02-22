import express from 'express';
import getRooms from '../controllers/roomControllers';

const router = express.Router();

router.get( '/', getRooms );

export default router;
