import User from "../Schema/userSchema.js";
import foodsmodel from "../Schema/foodsSchema.js";  // Import foodsmodel to populate the orders

async function getUsersWithOrders(req, res) {
  try {
    // Find all users whose 'orders' array is not empty
    const users = await User.find({ orders: { $not: { $size: 0 } } })
      .populate({
        path: 'orders',            // Specify the field to populate ('orders' array)
        model: foodsmodel,         // Specify the model to populate (foodsmodel)
        select: 'title price pic_url' // Select fields from foodsmodel to include in the response
      });

    if (!users || users.length === 0) {
      return res.send({ status: false, message: 'No users with orders found' });
    }

    // Return the list of users with their orders populated
    return res.send({ status: true, message: users });
  } catch (error) {
    console.error('Error fetching users with orders:', error);
    return res.send({ status: false, message: 'Oops, something went wrong' });
  }
}

export { getUsersWithOrders };
