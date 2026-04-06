import foodsmodel from '../Schema/foodsSchema.js'; // Adjust to your actual model import

export const getSingleFoodDetails = async (req, res) => {
    try {
        // Extract the product ID from the request body
        // Note: Check if your frontend sends it as '_id' or 'id'
        const { _id } = req.body; 

        // 1. Validate that the ID was provided
        if (!_id) {
            return res.status(400).json({
                success: false,
                message: "Product _id is required in the request body."
            });
        }

        // 2. Fetch the product from the database
        const product = await foodsmodel.findById(_id);

        // 3. Check if the product actually exists
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found."
            });
        }

        // 4. Return the successful response with the product data
        return res.status(200).json({
            success: true,
            message: "Product fetched successfully.",
            data: product
        });

    } catch (error) {
        console.error("Error fetching product:", error);

        // Handle specific Mongoose errors (e.g., if the _id format is invalid)
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID format."
            });
        }

        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};