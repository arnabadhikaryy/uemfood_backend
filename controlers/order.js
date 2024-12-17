import User from "../Schema/userSchema.js";

async function order(req, res) {
    const { user_phome_number, orderID } = req.body;

    // Check if both user_phome_number and orderID are provided
    if (!user_phome_number || !orderID) {
        return res.send({ status: false, message: 'Missing phone number or order ID' });
    }

    try {
        // Find user and update the orders array with the new orderID
        const result = await User.updateOne(
            { phone_number: user_phome_number },
            { $push: { orders: orderID } }
        );
console.log(result)
        // Check if the update was successful
        if (result.modifiedCount > 0) {
            return res.send({ status: true, message: 'Order placed successfully.' });
        } else {
            return res.send({ status: false, message: 'User not found or order was not updated.' });
        }
    } catch (error) {
        // Catch and log any errors that occur during the database operation
        console.error('Error placing order:', error);
        return res.send({ status: false, message: 'Oops, something went wrong. Please try again later.' });
    }
}

export { order };
