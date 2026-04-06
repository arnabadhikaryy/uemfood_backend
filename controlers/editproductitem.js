import foodsmodel from "../Schema/foodsSchema.js"; // Adjust the path based on your folder structure

export const editFoodItem = async (req, res) => {
    try {
        // Extract _id and any other fields from the request body
        const { _id, ...updateData } = req.body;

        // 1. Validate that the _id was actually provided
        if (!_id) {
            return res.status(400).json({ 
                success: false, 
                message: "Food item _id is required in the request body." 
            });
        }

        // 2. Perform the update operation
        const updatedFood = await foodsmodel.findByIdAndUpdate(
            _id, 
            updateData, 
            { 
                new: true,           // Returns the updated document instead of the original
                runValidators: true  // Forces Mongoose to respect your schema's 'required' rules
            }
        );

        // 3. Check if the item actually existed in the database
        if (!updatedFood) {
            return res.status(404).json({ 
                success: false, 
                message: "Food item not found." 
            });
        }

        // 4. Return the successful response
        return res.status(200).json({
            success: true,
            message: "Food item updated successfully.",
            data: updatedFood
        });

    } catch (error) {
        console.error("Error updating food item:", error);
        
        // Handle Mongoose validation errors specifically (e.g., trying to set price to a string)
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        return res.status(500).json({ 
            success: false, 
            message: "Internal server error." 
        });
    }
};