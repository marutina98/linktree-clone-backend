import express, { Request, Response } from 'express';
import LinkController from '../controllers/link.controller';

const router = express.Router();
const controller = new LinkController();

router.get('/', (request: Request, response: Response, next: Function) => controller.getLinks(request, response, next));
router.get('/:id', (request: Request, response: Response, next: Function) => controller.getLink(request, response, next));
router.post('/', (request: Request, response: Response, next: Function) => controller.createLink(request, response, next));
router.put('/:id/move-up', (request: Request, response: Response, next: Function) => controller.moveLinkUp(request, response, next));
router.put('/:id/move-down', (request: Request, response: Response, next: Function) => controller.moveLinkDown(request, response, next));
router.put('/:id', (request: Request, response: Response, next: Function) => controller.updateLink(request, response, next));
router.delete('/:id', (request: Request, response: Response, next: Function) => controller.deleteLink(request, response, next));

export default router;