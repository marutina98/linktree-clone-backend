import express from 'express';
import AuthenticationController from '../controllers/authentication.controller';

const router = express.Router();
const controller = new AuthenticationController();

router.post('/', controller.registerUser);

export default router;