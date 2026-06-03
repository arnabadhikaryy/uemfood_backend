

import foodsmodel from "../Schema/foodsSchema.js";
import cloudinary from 'cloudinary';

const addFoodReview = async (req, res) => {
    try {
        // 1. Extract data from the request
        // Note: You must send foodId from the frontend so the database knows which item to update.
        const { foodId, userId, userName, rating, comment, profile_image } = req.body;

        // Basic validation to ensure no missing fields
        if (!foodId || !userId || !userName || !rating || !comment || !profile_image) {
            return res.status(400).send({ 
                status: false, 
                message: 'All fields (foodId, userId, userName, rating, comment, profile_image) are required.' 
            });
        }

        // 2. Find the specific food item in the database
        const foodItem = await foodsmodel.findById(foodId);
        if (!foodItem) {
            return res.status(404).send({ status: false, message: 'Food item not found.' });
        }

        // 3. Check if the user has already reviewed this specific food item
        // We convert the ObjectIds to strings to ensure an accurate comparison
        const alreadyReviewed = foodItem.reviews.find(
            (review) => review.user.toString() === userId.toString()
        );

        if (alreadyReviewed) {
            return res.status(400).send({ 
                status: false, 
                message: 'You have already reviewed this item. You cannot submit multiple reviews.' 
            });
        }

        // 4. Handle Cloudinary Image Upload (if an image was attached)
        let reviewImageUrl = null;
        if (req.file) {
            cloudinary.config({
                cloud_name: process.env.CLOUDENAME,
                api_key: process.env.API_KEY,
                api_secret: process.env.CLOUDAPIKEY
            });

            const uploadResult = await cloudinary.v2.uploader.upload(req.file.path, {
                folder: 'uemfoods_reviews', // Keeping it organized in a reviews folder
                width: 250,
                height: 250,
                crop: 'fill'
            });

            reviewImageUrl = uploadResult.secure_url;
        }

        // 5. Construct the new review object mapping to your reviewSchema
        const newReview = {
            user: userId,
            userName: userName,
            userImage: profile_image,
            rating: Number(rating),
            comment: comment,
            // If an image was uploaded, put it in the array. Otherwise, keep it empty.
            reviewImages: reviewImageUrl ? [reviewImageUrl] : [] 
        };

        // 6. Push the review to the food item's reviews array and save
        foodItem.reviews.push(newReview);
        await foodItem.save();

        return res.status(201).send({ 
            status: true, 
            message: 'Review submitted successfully!',
            review: newReview
        });

    } catch (error) {
        console.error('Error adding review:', error);
        return res.status(500).send({ 
            status: false, 
            message: 'Oops, something went wrong while submitting your review.' 
        });
    }
};

export { addFoodReview };