import foodsmodel from "../Schema/foodsSchema.js"; // Adjust the path
import cloudinary from 'cloudinary'; // Make sure you import Cloudinary!
import redisClient from "./radisClient.js";

export const editFoodItem = async (req, res) => {
    try {
        // Extract _id and any other text fields from the request body
        const { _id, ...updateData } = req.body;

        // 1. Validate that the _id was actually provided
        if (!_id) {
            return res.status(400).json({ 
                success: false, 
                message: "Food item _id is required in the request body." 
            });
        }

        // 2. CHECK FOR NEW IMAGE: If a file was uploaded, send it to Cloudinary
        if (req.file) {
            cloudinary.config({ 
                cloud_name: process.env.CLOUDENAME , 
                api_key: process.env.API_KEY, 
                api_secret: process.env.API__SECRET 
            });

            try {
                const uploadResult = await cloudinary.v2.uploader.upload(
                    req.file.path, {
                        folder: 'uemfooditems', // Keeping them in a specific folder
                        width: 500, // Optional: adjust based on your UI needs
                        height: 500,
                        crop: "fill"
                    }
                );
                
                // IMPORTANT: Add the new Cloudinary URL to our update payload
                // Make sure "pic_url" matches the exact field name in your MongoDB schema
                updateData.pic_url = uploadResult.secure_url;  

            } catch (error) {
                console.error("Cloudinary upload error:", error);
                return res.status(500).json({ 
                    success: false, 
                    message: "Failed to upload image to Cloudinary." 
                });
            }
        }

        // 3. Perform the update operation in MongoDB
        const updatedFood = await foodsmodel.findByIdAndUpdate(
            _id, 
            updateData, 
            { 
                new: true,           
                runValidators: true  
            }
        );

        // 4. Check if the item actually existed
        if (!updatedFood) {
            return res.status(404).json({ 
                success: false, 
                message: "Food item not found." 
            });
        }

        // 5. INVALIDATE CACHE: Delete the outdated 'allFoods' cache from Redis
        // We only do this AFTER confirming the database update was successful
        await redisClient.del('allFoods');

        // 6. Return success
        return res.status(200).json({
            success: true,
            message: "Food item updated successfully.",
            data: updatedFood
        });

    } catch (error) {
        console.error("Error updating food item:", error);
        
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