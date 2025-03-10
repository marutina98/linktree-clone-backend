import express from 'express';
import { PrismaClient } from '@prisma/client';
import LinkController from '../controllers/link.controller';

const router = express.Router();
const prisma = new PrismaClient();
const controller = new LinkController(prisma);

// routes here

export default router;