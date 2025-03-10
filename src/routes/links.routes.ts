import express from 'express';
import LinkController from '../controllers/link.controller';
import { prisma } from '../services/prisma.service';

const router = express.Router();
const controller = new LinkController(prisma);

// routes here

export default router;