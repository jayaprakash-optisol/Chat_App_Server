import { Router } from 'express';
import MessageController from '../Controllers/MessageController';
import { protect } from '../middlewares/authMiddleware';

const router = Router();

router.route('/').post(protect, MessageController.sendMessage);
router.route('/:chatId').get(protect, MessageController.allMessages);

export = router;
