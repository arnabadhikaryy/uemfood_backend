import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
        default: 'Experience the authentic taste prepared with premium ingredients. Perfect for a delightful meal.'
    },
    pic_url: {
        type: String
    },
    availability: {
        type: Boolean,
        default: true
    },
    price: {
        type: Number,
        required: true
    }
})  // Optional: adds createdAt and updatedAt timestamps

const foodsmodel = mongoose.model('foodelmodel', foodSchema);

export default foodsmodel
