import express from 'express';
import userControllers from '../controllers/userController.js';

const router = express.Router();


router.post( '/register', userControllers.register );

router.post( '/login', userControllers.login );



export default router;
