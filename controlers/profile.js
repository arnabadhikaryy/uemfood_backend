//import authenticateJWT from "../middleware/authinticateToken.js";

function profile(req,res){
    res.send({status:true,message:req.JsonUserInfo})
}

export {profile};