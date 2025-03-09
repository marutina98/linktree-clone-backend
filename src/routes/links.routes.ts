import express from 'express';
import { PrismaClient } from '@prisma/client';
// import controller here

const router = express.Router();
const prisma = new PrismaClient();
// create controller here

// routes here

export default router;