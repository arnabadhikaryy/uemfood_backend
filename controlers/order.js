import User from "../Schema/userSchema.js";
import foodsmodel from "../Schema/foodsSchema.js";
import whatsappClient from "./whatsappClient.js";

async function order(req, res) {
    const { user_phome_number = req.JsonUserInfo.phone, orderID } = req.body;

    if (!user_phome_number) {
        return res.send({ status: false, message: 'Missing phone number' });
    }
    if (!orderID) {
        return res.send({ status: false, message: 'Missing order ID' });
    }

    try {
        let userdetails = await User.findOne({ phone_number: user_phome_number });
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

        // Find user and update the orders array
        const result = await User.updateOne(
            { phone_number: user_phome_number },
            { $push: { orders: orderID } }
        );

        if (result.modifiedCount > 0) {
            
            // --- WHATSAPP MESSAGING LOGIC ---
            
            // 1. Format the target number (Add your country code without the '+', e.g., '91' for India)
            const targetNumber = '917365075168';
            const chatId = `${targetNumber}@c.us`;

            // 2. Construct the message string using template literals
            const alertMessage = `*New Order Placed!* 🍔\n\n*Customer Details:*\nName: ${user_name}\nPhone: ${user_phone}\nAddress: ${user_address}\nProfile Pic: ${user_image}\n\n*Order Details:*\nItem: ${order_title}\nPrice: ${order_price}\nAvailability: ${order_availability}\nItem Pic: ${order_image}\nDescription: ${order_description}`;

            // 3. Send the message asynchronously (no need to await it and slow down the user's response)
            whatsappClient.sendMessage(chatId, alertMessage)
                .then(() => console.log('WhatsApp alert sent successfully to admin!'))
                .catch(err => console.error('Failed to send WhatsApp alert:', err));
            
            // ---------------------------------

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