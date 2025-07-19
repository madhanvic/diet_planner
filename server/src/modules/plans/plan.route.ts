import express from 'express';
import { genratePlan, getMyPlan, updateMyPlan } from './plan.controller';

const router = express.Router();

router.route('/genrate').post(genratePlan);
router.route('/update').post(updateMyPlan);
router.route('/').get(getMyPlan);

export default router;
