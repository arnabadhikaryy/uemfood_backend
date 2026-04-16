import User from "../Schema/userSchema.js";
import foodsmodel from "../Schema/foodsSchema.js";
import twilio from "twilio";

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
            const accountSid = process.env.accountSid; 
            const authToken = process.env.authToken;
            
            const client = twilio(accountSid, authToken);

            try {
                const alertMessage = `*New Order Placed!* 🍔\n\n*Customer Details:*\nName: ${user_name}\nPhone: ${user_phone}\nAddress: ${user_address}\nProfile Pic: ${user_image}\n\n*Order Details:*\nItem: ${order_title}\nPrice: ${order_price}\nAvailability: ${order_availability}\nItem Pic: ${order_image}\nDescription: ${order_description}`;

                const message = await client.messages.create({
                    from: 'whatsapp:+14155238886',
                    body: alertMessage,
                    to: 'whatsapp:+917365075168'
                });
              //  console.log("WhatsApp message sent:", message.sid);
            } catch (twilioError) {
                console.error("Failed to send WhatsApp alert:", twilioError);
            }

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