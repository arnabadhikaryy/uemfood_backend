import { v2 as cloudinary } from 'cloudinary';

async function upload_img_cloud(filepath) {

    // Configuration
    cloudinary.config({ 
        cloud_name: 'di4skdwzm', 
        api_key: '419514619628391', 
        api_secret: process.env.CLOUDAPIKEY // Click 'View API Keys' above to copy your API secret
    });
    
    // Upload an image
     const uploadResult = await cloudinary.uploader
       .upload(
           filepath, {
               folder: 'foodsWeb',
           }
       )
       .catch((error) => {
           console.log(error);
       });
    
    console.log(uploadResult);
    
    // Optimize delivery by resizing and applying auto-format and auto-quality
    const optimizeUrl = cloudinary.url('shoes', {
        fetch_format: 'auto',
        quality: 'auto'
    });
    
    console.log(optimizeUrl);
    
    // Transform the image: auto-crop to square aspect_ratio
    const autoCropUrl = cloudinary.url('shoes', {
        crop: 'auto',
        gravity: 'auto',
        width: 500,
        height: 500,
    });
    
    console.log(autoCropUrl);    
};

export default upload_img_cloud;