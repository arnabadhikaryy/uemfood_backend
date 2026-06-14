
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
      // NEW: Cart array to manage "Add to Cart" functionality
      cart: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'foodelmodel',
            required: true
        }
    }],
    orders: [{
        foodItem: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'foodelmodel',
            required: true
        },
        foodName: {
            type: String,
            required: true
        },
        foodImage: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
            default: 1
        },
        priceAtPurchase: {
            type: Number,
            default: null
        },
        status: {
            type: String,
            enum: ['Pending', 'Processing', 'out of delivery', 'Delivered', 'Cancelled'],
            default: 'Pending'
        },
        paymentstatus: {
            type: String,
            enum: ['Pending', 'Success', 'Failed'],
            default: 'Pending'
        }
    }],
});

const User = mongoose.model('User', userSchema);

export default User
