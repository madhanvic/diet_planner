import express from 'express';
import { protectService } from '../auth/auth.service';
import planRouter from '../plans/plan.route';

const router = express.Router();

router.use(protectService);

router.use('/plan', planRouter);

export default router;
