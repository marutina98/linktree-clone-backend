import express, { Request, Response } from 'express';
import AuthenticationController from '../controllers/authentication.controller';

const router = express.Router();
const controller = new AuthenticationController();

router.post('/register', (request: Request, response: Response, next: Function) => controller.registerUser(request, response, next));
router.post('/login', (request: Request, response: Response, next: Function) => controller.login(request, response, next));
router.post('/logout', (request: Request, response: Response, next: Function) => controller.logout(request, response, next));

export default router;