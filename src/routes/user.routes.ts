import express from 'express';
import UserController from '../controllers/user.controller';
import { prisma } from '../services/prisma.service';

const router = express.Router();
const controller = new UserController(prisma);

router.get('/', controller.getUsers.bind(controller));
router.get('/:id', controller.getUser.bind(controller));
router.post('/', controller.createUser.bind(controller));
router.put('/:id', controller.updateUser.bind(controller));
router.delete('/:id', controller.deleteUser.bind(controller));

export default router;