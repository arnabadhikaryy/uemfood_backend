
import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    imageURL: {
        type: String
    },
    phone_number: {
        type: String,
        required: true,
        unique: true // Ensures phone numbers are unique
    },
    password:{
        type:String,
        require:true
    },
    address:{
        type:String,
        require:true
    },
    orders: [{
        type: mongoose.Schema.Types.ObjectId, // Assuming order IDs are ObjectIDs
        ref: 'foodsmodel' // Reference to the Order model
    }]
});

const User = mongoose.model('User', userSchema);

export default User
