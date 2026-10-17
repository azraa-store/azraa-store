import { Router } from 'express';
import razorpay from './razorpay.js';
import paystack from './paystack.js';
import flutterwave from './flutterwave.js';
import paypal from './paypal.js';

const router = Router();
router.use('/razorpay', razorpay);
router.use('/paystack', paystack);
router.use('/flutterwave', flutterwave);
router.use('/paypal', paypal);

export default router;
