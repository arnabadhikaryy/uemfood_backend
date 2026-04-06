

// Import your model (adjust the path to where your model file is located)
import foodsmodel from "../Schema/foodsSchema.js"; 

export const deleteFoodItem = async (req, res) => {
    try {
        // 1. Extract the _id from the request body
        const { _id } = req.body;

        // 2. Validate that an _id was actually provided
        if (!_id) {
            return res.status(400).json({ 
                success: false, 
                message: "Food item _id is required." 
            });
        }

        // 3. Find the document by its ID and delete it
        const deletedFood = await foodsmodel.findByIdAndDelete(_id);

        // 4. Check if the item existed in the database
        if (!deletedFood) {
            return res.status(404).json({ 
                success: false, 
                message: "Food item not found in the database." 
            });
        }

        // 5. Send a success response back to the client
        return res.status(200).json({
            success: true,
            message: "Food item deleted successfully.",
            data: deletedFood // Optional: send back the deleted item's data
        });

    } catch (error) {
        // 6. Catch any server errors (e.g., Mongoose casting errors for malformed IDs)
        console.error("Error deleting food item:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while deleting the food item.",
            error: error.message
        });
    }
};