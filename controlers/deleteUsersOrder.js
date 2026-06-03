

import User from "../Schema/userSchema.js";

export const removeOrderFromUser = async (req, res) => {
    try {
        const { userId, orderId } = req.body;

        if (!userId || !orderId) {
            return res.status(400).json({ success: false, message: "userId and orderId are required" });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const index = user.orders.indexOf(orderId);
        console.log('orderId is',orderId);
      
        console.log('index is', index);
        if (index !== -1) {
            user.orders.splice(index, 1);
            await user.save();
            console.log(user.orders);
        }
        console.log('One order item removed from user', user.name);

        return res.status(200).json({ success: true, message: "One order item removed", data: user });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};