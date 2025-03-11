import express from 'express';
import LinkController from '../controllers/link.controller';

const router = express.Router();
const controller = new LinkController();

router.get('/', controller.getLinks);
router.get('/:id', controller.getLink);

router.put('/:id/move-up', controller.moveLinkUp);
router.put('/:id/move-down', controller.moveLinkDown);

export default router;