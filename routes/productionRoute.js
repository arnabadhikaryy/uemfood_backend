import express from 'express'
import { addfood } from '../controlers/addfood.js';
const PRODUCTION_router = express.Router();
import multer from "multer";
import { order } from '../controlers/order.js';
import { myAllOrders } from '../controlers/myAllOrders.js';
import { getUsersWithOrders } from '../controlers/getuserwithorder.js';
import { getAllFoods } from '../controlers/getallfood.js';
import authenticateJWT from '../middleware/authinticateToken.js';
const upload = multer({ dest: 'uploads' })

// Define a route
PRODUCTION_router.get('/', (req, res) => {
    res.send('this is product route');// this gets executed when user visit http://localhost:3000/products
});

PRODUCTION_router.get('/101', (req, res) => {
    res.send('this is product 101 route');// this gets executed when user visit http://localhost:3000/product/101
});

PRODUCTION_router.get('/102', (req, res) => {
    res.send('this is product 102 route');// this gets executed when user visit http://localhost:3000/product/102
});

PRODUCTION_router.post('/addfood',upload.single('pic_url_file'),addfood);
PRODUCTION_router.post('/order',order);
PRODUCTION_router.post('/my/all/orders',authenticateJWT,myAllOrders);
PRODUCTION_router.get('/getUsersWithOrders',getUsersWithOrders);
PRODUCTION_router.get('/getallfood',getAllFoods);

export default PRODUCTION_router