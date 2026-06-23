import express from 'express';
import { createLog, getLogs, deleteLog } from '../controllers/nutrition.controller.js';

const router = express.Router();

router.post('/log', createLog);
router.get('/logs', getLogs);
router.delete('/log/:id', deleteLog);

export default router;
