import User from "../Schema/userSchema.js";
import foodsmodel from "../Schema/foodsSchema.js";  // Import foodsmodel to populate the orders

async function myAllOrders(req, res) {
  console.log(req.JsonUserInfo.phone)
  let phone_number = req.JsonUserInfo.phone;
console.log('phone number is [myAllOrders]',phone_number)
  // Check if phone_number is provided
  if (!phone_number) {
    return res.send({ status: false, message: 'Phone number is required' });
  }

  try {
    // Find the user by phone number and populate the 'orders' array with the food details
    const user = await User.findOne({phone_number:phone_number})
      .populate({
        path: 'orders',          // Specify the field to populate (the 'orders' field in User)
        model: foodsmodel,       // Specify the model to populate (foodsmodel)
        select: 'title price pic_url' // Select which fields to return from foodsmodel
      }); 

    if (!user) {
      return res.send({ status: false, message: 'User not found' });
    }

    // Return the populated orders (full food details)
    return res.send({ status: true, orders: user.orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return res.send({ status: false, message: 'Oops, something went wrong' });
  }
}

export { myAllOrders };
