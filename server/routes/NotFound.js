import express from 'express';
import notFoundController from '../controllers/notFoundController.js';

const router = express.Router();

router.get('*', notFoundController);


export default router;
