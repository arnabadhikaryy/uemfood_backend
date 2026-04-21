// server.js
import express from 'express'
import mongoose from 'mongoose'
import 'dotenv/config'
import cors from 'cors'
import cookieParser from 'cookie-parser'

// Import Redis Client
import redisClient from './controlers/radisClient.js'

// Include route files
import USER_router from './routes/userRout.js'
import PRODUCTION_router from './routes/productionRoute.js'
import PAYMENT_router from './routes/payment.js'

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
const port = process.env.PORT

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/user', USER_router)
app.use('/production', PRODUCTION_router)
app.use('/api/v1/orders', PAYMENT_router)

app.listen(port, async () => {
  console.log(`Example app listening on port http://localhost:${port}`)
  
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB);
    console.log('Database connected');

    // Connect to Redis
    await redisClient.connect();
    console.log('Redis connected');

  } catch (error) {
    console.error('Connection error:', error);
  }
})