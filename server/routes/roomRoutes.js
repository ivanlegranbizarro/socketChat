import express from 'express';
import getRooms from '../controllers/roomControllers.js';

const router = express.Router();

router.get( '/', getRooms );

export default router;
