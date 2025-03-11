import express from 'express';
import AuthenticationController from '../controllers/authentication.controller';

const router = express.Router();
const controller = new AuthenticationController();

// routes here

export default router;