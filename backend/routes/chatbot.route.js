import express from 'express'
import { Message, getHistory } from '../controllers/chatbot.message.js';

const router = express.Router();

router.post("/message",Message)
router.get("/history", getHistory)

export default router