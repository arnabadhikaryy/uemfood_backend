//edited by: [arnab]

import User from "../Schema/userSchema.js";

async function profile(req,res){
    console.log('middelware details: ', req.JsonUserInfo)

    try {
        // Find user by ID from the token
        let response = await User.findOne({ _id: req.JsonUserInfo.userId });
        if (response) {
            // Send user data in response
            return res.send({
                status: true,
                message: 'User profile retrieved successfully',
                data: response
            });
        } else {
            return res.send({ status: false, message: 'User not found' });
        }
    }
    catch (error) {
        console.error(error);
        return res.send({ status: false, message: 'Oops, something went wrong!' });
    }
    //res.send({status:true,message:req.JsonUserInfo})
}

export {profile};
