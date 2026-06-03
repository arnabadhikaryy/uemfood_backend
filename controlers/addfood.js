import foodsmodel from "../Schema/foodsSchema.js";
import cloudinary from 'cloudinary';
import multer from "multer";
const upload = multer({ dest: 'uploads/' });
import redisClient from "./radisClient.js";

async function addfood(req, res) {
  const { 
    title, 
    price, 
    description, 
    category, 
    availability, 
    discount, 
    shop_name, 
    shop_address, 
    shop_type,
    shop_image,
    pic_url // Direct image URL
  } = req.body;
  
  let foodURL = '';

  // Check for missing required fields
  if (!title || !price) {
    return res.send({ status: false, message: 'Title and price are required fields' });
  }

  try {
    // Handle image: prioritize file upload, then direct URL, then default
    if (req.file) {
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
        crop: 'fill'
      });

      foodURL = uploadResult.secure_url;
    } else if (pic_url && pic_url.trim() !== '') {
      // Use direct image URL if provided
      foodURL = pic_url;
    }

    // Create new food item with all schema fields
    const newfood = new foodsmodel({
      title: title,
      description: description || 'Experience the authentic taste prepared with premium ingredients. Perfect for a delightful meal.',
      pic_url: foodURL,
      category: category || 'Food',
      availability: availability === 'false' ? false : true, // Handle string boolean
      price: Number(price),
      discount: discount ? Number(discount) : 0,
      shop_name: shop_name || 'Hungry Baba',
      shop_address: shop_address || 'CHANDPARA',
      shop_type: shop_type || 'Restaurant',
      shop_image: shop_image || 'https://img.magnific.com/premium-vector/shops-stores-icons-set-flat-design-style-vector-illustration_498048-1862.jpg?semt=ais_hybrid&w=740&q=80'
    });

    // Save to database
    const response = await newfood.save();
    if (response) {
      // Invalidate cache
      await redisClient.del('allFoods');
      
      return res.send({ 
        status: true, 
        message: 'Food listed successfully',
        data: response
      });
    } else {
      return res.send({ status: false, message: 'Failed to list food' });
    }

  } catch (error) {
    console.error('Error in addfood:', error);
    return res.send({ status: false, message: 'Oops, something went wrong!' });
  }
}

export { addfood };