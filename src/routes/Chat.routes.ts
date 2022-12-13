import { Router } from 'express';
import ChatController from '../Controllers/ChatController';
import { protect } from '../middlewares/authMiddleware';

const router = Router();

router.route('/').post(protect, ChatController.accessChat);
router.route('/fetch').get(protect, ChatController.fetchChats);
router.route('/group').post(protect, ChatController.createGroupChat);
router.route('/rename').put(protect, ChatController.renameGroup);
router.route('/addgroup').put(protect, ChatController.addToGroup);
router.route('/removegroup').put(protect, ChatController.removeFromGroup);

export = router;
