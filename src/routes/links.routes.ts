import express from 'express';
import LinkController from '../controllers/link.controller';

const router = express.Router();
const controller = new LinkController();

// routes here

export default router;