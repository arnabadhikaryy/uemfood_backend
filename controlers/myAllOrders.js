import User from "../Schema/userSchema.js";
import foodsmodel from "../Schema/foodsSchema.js";

async function myAllOrders(req, res) {
  let phone_number = req.JsonUserInfo?.phone;

  if (!phone_number) {
    return res.send({ status: false, message: 'Phone number is required' });
  }

  try {
    const user = await User.findOne({ phone_number: phone_number })
      .populate({
        path: 'orders.foodItem', // IMPORTANT: Point specifically to the nested foodItem field
        model: foodsmodel,       
      }); 

    if (!user) {
      return res.send({ status: false, message: 'User not found' });
    }

    // Filter out any orders where the food item might have been deleted from the database
    const validOrders = user.orders.filter(order => order.foodItem != null);

    return res.send({ status: true, orders: validOrders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return res.send({ status: false, message: 'Oops, something went wrong' });
  }
}

export { myAllOrders };