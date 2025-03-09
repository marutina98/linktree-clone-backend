import express from 'express';
import UserController from '../controllers/user.controller';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();
const controller = new UserController(prisma);

router.get('/', controller.getUsers.bind(controller));
router.get('/:id', controller.getUser.bind(controller));

router.post('/', controller.createUser.bind(controller));
router.put('/', controller.updateUser.bind(controller));

export default router;