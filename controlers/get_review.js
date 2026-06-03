

import foodsmodel from "../Schema/foodsSchema.js";

const getFoodReviews = async (req, res) => {
    try {
        // 1. Extract foodId from the request body
        const { foodId } = req.body;

        // 2. Validate that foodId was provided
        if (!foodId) {
            return res.status(400).send({
                status: false,
                message: 'foodId is required to fetch reviews.'
            });
        }

        // 3. Find the food item in the database
        // We use .select() to only pull the 'reviews' and 'title' fields to save bandwidth
        const foodItem = await foodsmodel.findById(foodId).select('title reviews');

        if (!foodItem) {
            return res.status(404).send({
                status: false,
                message: 'Food item not found.'
            });
        }

        // 4. Sort reviews so the newest ones appear first
        // Since reviewSchema has { timestamps: true }, each review has a createdAt property
        const sortedReviews = foodItem.reviews.sort((a, b) => b.createdAt - a.createdAt);

        // 5. Return the reviews to the frontend
        return res.status(200).send({
            status: true,
            message: 'Reviews fetched successfully!',
            foodTitle: foodItem.title,
            totalReviews: sortedReviews.length,
            reviews: sortedReviews
        });

    } catch (error) {
        console.error('Error fetching food reviews:', error);
        
        // Handle invalid ObjectId errors (e.g., if a malformed foodId is sent)
        if (error.name === 'CastError') {
            return res.status(400).send({
                status: false,
                message: 'Invalid foodId format.'
            });
        }

        return res.status(500).send({
            status: false,
            message: 'Oops, something went wrong while fetching reviews.'
        });
    }
};

export { getFoodReviews };