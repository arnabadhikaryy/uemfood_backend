import express from 'express'
import { PAY ,Payment_response} from '../controlers/payment.js';
const PAYMENT_router = express.Router();

PAYMENT_router.post('/payment',PAY);
PAYMENT_router.post('/payment-response',Payment_response)


export default PAYMENT_router;