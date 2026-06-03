import express from 'express'
import { PAY ,Payment_response} from '../controlers/payment.js';
import { createPayment, verifyPayment } from '../controlers/paymentController.js';
import authenticateJWT from '../middleware/authinticateToken.js';   
const PAYMENT_router = express.Router();

//PAYMENT_router.post('/payment',PAY);
//PAYMENT_router.post('/payment-response',Payment_response)

PAYMENT_router.post('/payment',authenticateJWT,createPayment);
PAYMENT_router.post('/verify', verifyPayment);


export default PAYMENT_router;