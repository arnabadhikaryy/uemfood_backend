import express from 'express'
import { siginup } from '../controlers/createaccount.js';
import multer from "multer";
import { login } from '../controlers/login.js';
import authenticateJWT from '../middleware/authinticateToken.js';
import { profile } from '../controlers/profile.js';
const upload = multer({ dest: 'uploads' })

const USER_router = express.Router();

// Define a route
USER_router.get('/', (req, res) => {
    res.send('this is user route');// this gets executed when user visit http://localhost:3000/user
});

USER_router.get('/101', (req, res) => {
    res.send('this is user 101 route');// this gets executed when user visit http://localhost:3000/user/101
});

USER_router.get('/102', (req, res) => {
    res.send('this is user 102 route');// this gets executed when user visit http://localhost:3000/user/102
});

USER_router.post('/siginup',upload.single('avatar'),siginup)
USER_router.post('/login',login)
USER_router.post('/profile',authenticateJWT,profile);

export default USER_router;