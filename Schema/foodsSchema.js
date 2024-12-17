import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    pic_url: {
        type: String
    },
    price: {
        type: Number,
        required: true
    }
})  // Optional: adds createdAt and updatedAt timestamps

const foodsmodel = mongoose.model('foodelmodel', foodSchema);

export default foodsmodel
