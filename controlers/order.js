import User from "../Schema/userSchema.js";
import foodsmodel from "../Schema/foodsSchema.js";

// Store these securely in your .env file
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID;
const DELIVERY_CHAT_ID = process.env.DELIVERY_CHAT_ID;

// Helper function to escape HTML characters for Telegram
function escapeHTML(text) {
    if (!text) return "";
    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

/**
 * Sends a message to a specific Telegram Chat ID
 * @param {string} chatId - The ID of the user or group
 * @param {string} message - The text message to send
 */
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

async function order(req, res) {
    const { user_phone_number = req.JsonUserInfo?.phone, orderID } = req.body;

    if (!user_phone_number) {
        return res.send({ status: false, message: 'Missing phone number' });
    }
    if (!orderID) {
        return res.send({ status: false, message: 'Missing order ID' });
    }

    try {
        let userdetails = await User.findOne({ phone_number: user_phone_number });
        if (!userdetails) {
            return res.send({ status: false, message: 'User not found' });
        }

        let user_address = userdetails.address;
        let user_name = userdetails.name;
        let user_phone = userdetails.phone_number;
        let user_image = userdetails.imageURL;

        let orderdetails = await foodsmodel.findOne({ _id: orderID });
        if (!orderdetails) {
            return res.send({ status: false, message: 'Order not found' });
        }

        let order_title = orderdetails.title;
        let order_price = orderdetails.price;
        let order_image = orderdetails.pic_url;
        let order_description = orderdetails.description;
        let order_availability = orderdetails.availability;

        const result = await User.updateOne(
            { phone_number: user_phone_number },
            { $push: { orders: orderID } }
        );

        if (result.modifiedCount > 0) {
            
            // ---------------------------------------------------------
            // TELEGRAM NOTIFICATION LOGIC (HTML BASED)
            // ---------------------------------------------------------
            try {
                // Escape the dynamic data to prevent HTML parsing errors
                const safeName = escapeHTML(user_name);
                const safePhone = escapeHTML(user_phone);
                const safeAddress = escapeHTML(user_address);
                const safeTitle = escapeHTML(order_title);
                const safeDesc = escapeHTML(order_description);
                
                // 1. Admin Message Template (Using HTML tags)
                const adminMessage = `<b>🚨 New Order Placed on Hungry Baba!</b> 🍔\n\n<b>Customer Details:</b>\nName: ${safeName}\nPhone: ${safePhone}\nAddress: ${safeAddress}\nProfile Pic: ${user_image}\n\n<b>Order Details:</b>\nItem: ${safeTitle}\nPrice: ₹${order_price}\nAvailability: ${order_availability}\nDescription: ${safeDesc}\nItem Pic: ${order_image}`;
            
                // 2. Delivery Partner Message Template (Using HTML tags)
                const deliveryMessage = `<b>🛵 New Delivery Assignment!</b>\n\n<b>Pickup:</b> Restaurant\n<b>Drop-off:</b> ${safeAddress}\n\n<b>Customer:</b> ${safeName} (${safePhone})\n<b>Item:</b> ${safeTitle}`;
            
                // 3. Fire off the notifications asynchronously 
                await sendTelegramNotification(ADMIN_CHAT_ID, adminMessage);
              //  await sendTelegramNotification(DELIVERY_CHAT_ID, deliveryMessage);
                
            } catch (telegramError) {
                console.error("Failed to send Telegram alerts:", telegramError);
            }
            // ---------------------------------------------------------

            return res.send({ status: true, message: 'Order placed successfully.' });

        } else {
            return res.send({ status: false, message: 'User not found or order was not updated.' });
        }
    } catch (error) {
        console.error('Error placing order:', error);
        return res.send({ status: false, message: 'Oops, something went wrong. Please try again later.' });
    }
}

export { order };