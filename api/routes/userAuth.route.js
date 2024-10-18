import express from 'express';
import { google, signin, signup } from '../controllers/userAuth.controller.js';
const router = express();
router.post('/signup',signup);
router.post('/signin',signin);
router.post('/google',google);

export default router;