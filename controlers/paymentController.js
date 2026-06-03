import axios from "axios";
import User from "../Schema/userSchema.js";
import foodsmodel from "../Schema/foodsSchema.js";

// Store these securely in your .env file
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID;
const DELIVERY_CHAT_ID = process.env.DELIVERY_CHAT_ID;


async function sendTelegramNotification(chatId, message) {
    const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  
    try {
      const response = await fetch(telegramUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'HTML', // Changed to HTML for stability
        }),
      });
  
      const data = await response.json();
  
      if (!data.ok) {
        console.error('Telegram API Error:', data.description);
      }
    } catch (error) {
      console.error('Failed to send Telegram message:', error);
    }
  }






// Helper to determine the correct environment URL
const getBaseUrl = () => {
    return process.env.CASHFREE_ENVIRONMENT === "PRODUCTION" 
        ? "https://api.cashfree.com/pg/orders" 
        : "https://sandbox.cashfree.com/pg/orders";
};

// Common Headers for Cashfree
const getHeaders = () => ({
    'accept': 'application/json',
    'content-type': 'application/json',
    'x-api-version': '2023-08-01',
    'x-client-id': process.env.CASHFREE_APP_ID,
    'x-client-secret': process.env.CASHFREE_SECRET_KEY
});

// 1. Create Order Session
export const createPayment = async (req, res) => {
    try {
        const { amount, name, phone, orderID } = req.body;
        
        // Generate a unique order ID
        const cfOrderId = `ORDER_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

        const response = await axios.post(getBaseUrl(), {
            order_amount: amount,
            order_currency: "INR",
            order_id: cfOrderId,
            customer_details: {
                customer_id: phone,
                customer_phone: phone,
                customer_name: name || "Customer",
            },
            order_meta: {
                return_url: `${process.env.FRONTEND_URL}ordersuccess`
            }
        }, { headers: getHeaders() });
        
        // Send the payment session ID back to React
        res.json({ 
            success: true, 
            payment_session_id: response.data.payment_session_id,
            order_id: cfOrderId 
        });

    } catch (error) {
        console.error("CashFree Create Order Error:", error.response?.data || error.message);
        res.status(500).json({ success: false, message: "Could not initiate payment" });
    }
};

// 2. Verify Payment and Update DB
export const verifyPayment = async (req, res) => {
    try {
        const { cf_order_id, userPhone, foodOrderID, price } = req.body;

        // Fetch payment status directly from Cashfree
        const response = await axios.get(`${getBaseUrl()}/${cf_order_id}`, { 
            headers: getHeaders() 
        });

        if (response.data.order_status === "PAID") {
            let userdetails = await User.findOne({ phone_number: userPhone });
            let orderdetails = await foodsmodel.findOne({ _id: foodOrderID });

            if (userdetails && orderdetails) {
                // Update user orders
                await User.updateOne(
                    { phone_number: userPhone },
                    { $push: { orders: foodOrderID } }
                );

   await sendTelegramNotification(ADMIN_CHAT_ID, `New payed order placed of amount ${price}: ${userdetails.name} - ${orderdetails.title}`);
                
                return res.json({ success: true, message: "Payment verified and order placed!" });
            }
        }
        
        return res.status(400).json({ success: false, message: "Payment not successful or pending." });

    } catch (error) {
        console.error("Verification Error:", error.response?.data || error.message);
        res.status(500).json({ success: false, message: "Error verifying payment" });
    }
};