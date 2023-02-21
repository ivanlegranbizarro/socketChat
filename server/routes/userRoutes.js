import express from 'express';
import userControllers from '../controllers/userController.js';
import verifyToken from '../middlewares/verifyToken.js';

const router = express.Router();


router.post( '/register', userControllers.register );

router.post( '/login', userControllers.login );

router.get( '/verify', verifyToken, userControllers.verifyUser );



export default router;
