
import User from "../Schema/userSchema.js";

export const editUserBasicDetails = async (req, res) => {
    try {
        // Assuming you pass the user's ID in the URL parameters (e.g., /users/:userId)
        // If you are using JWT authentication, you might get this from req.user.id instead
       const userId = req.JsonUserInfo.userId;
        
        // Destructure only the basic fields from the request body
        const { name, imageURL, address, phone_number } = req.body;

        // Build an update object containing only the provided fields
        const updateData = {};
        if (name) updateData.name = name;
        if (imageURL) updateData.imageURL = imageURL;
        if (address) updateData.address = address;
        if (phone_number && phone_number.length === 10) {
            updateData.phone_number = phone_number;
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
                new: true,           // Returns the modified document rather than the original
                runValidators: true, // Runs schema validations (e.g., checking 'required' fields)
                select: '-password'  // Excludes the password from the returned object for security
            }
        );

        // Handle the case where the user doesn't exist in the database
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found." });
        }

        // Send back the successful response
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