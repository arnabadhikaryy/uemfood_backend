import foodsmodel from "../Schema/foodsSchema.js";
import cloudinary from 'cloudinary';
import multer from "multer";
const upload = multer({ dest: 'uploads/' }); // Add trailing slash for uploads folder

async function addfood(req, res) {
  const { title, price } = req.body;
  let foodURL = '';

  console.log(req.body); // Log request body for debugging

  // Check for missing title or price
  if (!title || !price) {
    return res.send({ status: false, message: 'Invalid price or title' });
  }

  try {
    // If a file is uploaded, handle Cloudinary upload
    if (req.file) {
      console.log('File received:', req.file);

      // Configure Cloudinary
      cloudinary.config({
        cloud_name: process.env.CLOUDENAME,
        api_key: process.env.API_KEY,
        api_secret: process.env.CLOUDAPIKEY
      });

      // Upload the image to Cloudinary
      const uploadResult = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: 'uemfoods',
        width: 250,
        height: 250,
        crop: 'fill'  // Ensure the image is cropped to fit the dimensions
      });

      console.log('Cloudinary upload result:', uploadResult);
      foodURL = uploadResult.secure_url; // Get the URL of the uploaded image
    }

    // Create a new food item with the provided data and uploaded image URL
    const newfood = new foodsmodel({
      title: title,
      price: price,
      pic_url: foodURL // The image URL from Cloudinary, or empty if no file uploaded
    });

    // Save the new food item to the database
    const response = await newfood.save();
    if (response) {
      return res.send({ status: true, message: 'Food listed successfully' });
    } else {
      return res.send({ status: false, message: 'Failed to list food' });
    }

  } catch (error) {
    console.error('Error in addfood:', error);
    return res.send({ status: false, message: 'Oops, something went wrong!' });
  }
}

export { addfood };
