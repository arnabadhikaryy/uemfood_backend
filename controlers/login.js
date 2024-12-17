import User from "../Schema/userSchema.js";
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';

async function login(req, res) {
  const { phone, password } = req.body;
  console.log(req.body);

  if (!phone || !password) {
    return res.send({ status: false, message: 'Invalid phone number or password' });
  }

  try {
    // Find user by phone number
    let response = await User.findOne({ phone_number: phone });
    if (response) {
      // Check if password is correct
     // console.log(response)
      if (password == response.password) {
        // Generate JWT token
        const token = jwt.sign({
          exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7), // Token expiry in 1 week
          userId: response._id, // Store the user's ID in the token
          name:response.name,
          phone:response.phone_number,
          img_url:response.imageURL
        }, process.env.JWT_SECRET);

        //console.log('Token is', token);

        // Set the token in the response cookie
        res.cookie('token', token, { 
          maxAge: 60 * 60 * 1000,
          sameSite: 'None'
        });

        // Send response with user data
        return res.send({
          status: true,
          message: 'Correct password',
          data: response
        });
      } else {
        return res.send({ status: false, message: 'Incorrect password' });
      }
    } else {
      return res.send({ status: false, message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    return res.send({ status: false, message: 'Oops, something went wrong!' });
  }
}

export { login };
