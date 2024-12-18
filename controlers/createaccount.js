import User from "../Schema/userSchema.js";
import cloudinary from 'cloudinary';
import fs from 'fs';
import path from 'path';

async function siginup(req,res){

  const {fullName,phone,password,user_address}=req.body;
  console.log(req)
  let profileURL='https://e7.pngegg.com/pngimages/84/165/png-clipart-united-states-avatar-organization-information-user-avatar-service-computer-wallpaper-thumbnail.png';

  if(!fullName || !phone || !password ){
    res.send({status:false,message:'invalid name,phone,password'})
  }
  else{
    if(req.file){
      console.log(req.file)

      // Configuration
    cloudinary.config({ 
      cloud_name: process.env.CLOUDENAME , 
      api_key: process.env.API_KEY, 
      api_secret: process.env.CLOUDAPIKEY // Click 'View API Keys' above to copy your API secret
  });

  // Upload an image
  try {
    const uploadResult = await cloudinary.v2.uploader
  .upload(
      req.file.path, {
          folder:'uemfooduser',
          width:250,
          height:250
      }
  )
  console.log('uploadResult is:_ ',uploadResult);
  profileURL=uploadResult.secure_url;  
  }
  catch(error) {
      console.log(error);
  };

    }

    const user=new User({
      name:fullName,
      phone_number:phone,
      password:password,
      imageURL:profileURL,
      address:user_address
    })

    try {
      let response = await user.save();
      if(response){
        res.send({status:true,message:'account created succesfully'})
      }
    } catch (error) {
      console.log(error);
      res.send({status:false,message:'oops somthing wrong!'})
    }
  }

}
export {siginup}
