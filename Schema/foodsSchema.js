import mongoose from "mongoose";




// 1. Define the Review Schema (Subdocument)
const reviewSchema = new mongoose.Schema(
    {
        // Links the review to a specific user
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', 
            required: true
        },
        userName: {
            type: String,
            required: true
        },
        userImage: {
            type: String,
            default: 'https://e7.pngegg.com/pngimages/84/165/png-clipart-united-states-avatar-organization-information-user-avatar-service-computer-wallpaper-thumbnail.png'
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        comment: {
            type: String,
            required: true
        },
        // Allows users to attach multiple image URLs to their review
        reviewImages: [{
            type: String
        }]
    }, 
    { timestamps: true } 
);





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
    },
    discount: {
        type: Number,
        default: 0
    },
    shop_name: {
        type: String,
        default: 'Hungry Baba'
    },
    shop_address: {
        type: String,
        default: 'CHANDPARA'
    },
    shop_type: {
        type: String,
        default: 'Restaurant'
    },
    shop_image: {
        type: String,
        default: 'https://img.magnific.com/premium-vector/shops-stores-icons-set-flat-design-style-vector-illustration_498048-1862.jpg?semt=ais_hybrid&w=740&q=80'
    },

    reviews: [reviewSchema]
})

const foodsmodel = mongoose.model('foodelmodel', foodSchema);

export default foodsmodel; 