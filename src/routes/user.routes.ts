import express, { Request, Response } from 'express';
import UserController from '../controllers/user.controller';

const router = express.Router();
const controller = new UserController();

router.get('/', (request: Request, response: Response, next: Function) => controller.getUsers(request, response, next));
router.get('/:id', (request: Request, response: Response, next: Function) => controller.getUser(request, response, next));
router.put('/:id', (request: Request, response: Response, next: Function) => controller.updateUser(request, response, next));
router.delete('/:id', (request: Request, response: Response, next: Function) => controller.deleteUser(request, response, next));

export default router;