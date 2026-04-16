import User from "../Schema/userSchema.js";
import cloudinary from 'cloudinary';

export const editUserBasicDetails = async (req, res) => {
    try {
        const userId = req.JsonUserInfo.userId;
        
        // Destructure only text fields from req.body
        const { name, address, phone_number } = req.body;

        // Build an update object
        const updateData = {};
        if (name) updateData.name = name;
        if (address) updateData.address = address;
        if (phone_number && phone_number.length === 10) {
            updateData.phone_number = phone_number;
        }

        // --- NEW: Cloudinary Image Upload Logic ---
        if (req.file) {
            cloudinary.config({ 
                cloud_name: process.env.CLOUDENAME, 
                api_key: process.env.API_KEY, 
                api_secret: process.env.API__SECRET 
            });

            try {
                const uploadResult = await cloudinary.v2.uploader.upload(
                    req.file.path, {
                        folder: 'uemfooduser',
                        width: 250,
                        height: 250
                    }
                );
                // Assign the Cloudinary URL to the update object
                updateData.imageURL = uploadResult.secure_url;  
            } catch (error) {
                console.error("Cloudinary upload error:", error);
                return res.status(500).json({ message: "Failed to upload profile image." });
            }
        }

        // Ensure there is actually data to update
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: "No valid fields provided for update." });
        }

        // Perform the update
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updateData },
            { 
                new: true,           
                runValidators: true, 
                select: '-password'  
            }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found." });
        }

        return res.status(200).json({
            message: "User details updated successfully",
            user: updatedUser
        });

    } catch (error) {
        console.error("Error updating user details:", error);
        return res.status(500).json({ 
            message: "Internal server error", 
            error: error.message 
        });
    }
};