
// Imports

import express, { Request, Response } from 'express';
import UserController from '../controllers/user.controller';

// Middleware

import isAuthenticated from '../middlewares/is-authenticated.middleware';
import isOwnerUser from '../middlewares/is-owner-user.middleware';

// Routes

const router = express.Router();
const controller = new UserController();

router.get('/authenticated', isAuthenticated, (request: Request, response: Response, next: Function) => controller.getAuthenticatedUser(request, response, next));
router.get('/', (request: Request, response: Response, next: Function) => controller.getUsers(request, response, next));
router.get('/:id', (request: Request, response: Response, next: Function) => controller.getUser(request, response, next));
router.put('/', isAuthenticated, (request: Request, response: Response, next: Function) => controller.updateUser(request, response, next));
router.delete('/', isAuthenticated, (request: Request, response: Response, next: Function) => controller.deleteUser(request, response, next));

export default router;