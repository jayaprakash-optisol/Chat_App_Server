import { Router } from 'express';
import UserController from '../Controllers/UserController';
import { protect } from '../middlewares/authMiddleware';

const router = Router();

router.route('/register').post(UserController.registerUser);
router.route('/fetch').get(protect, UserController.fetchUsers);
router.route('/login').post(UserController.authUser);

export = router;
