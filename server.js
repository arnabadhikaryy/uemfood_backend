// server.js
import express from 'express'
import mongoose from 'mongoose'
import 'dotenv/config'
import cors from 'cors'
import cookieParser from 'cookie-parser'
// Include route files
import USER_router from './routes/userRout.js'
import PRODUCTION_router from './routes/productionRoute.js'
import PAYMENT_router from './routes/payment.js'
const app = express()
app.use(cors({
  origin:'https://musical-druid-b3fc0d.netlify.app',
  credentials:true
}));
app.use(express.json());
app.use(cookieParser());
const port = process.env.PORT


app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.use('/user',USER_router)
app.use('/production',PRODUCTION_router)
app.use('/api/v1/orders',PAYMENT_router)

app.listen(port, async () => {
  console.log(`Example app listening on port http://localhost:${process.env.PORT}`)
  try {
    const db=mongoose.connect(process.env.MONGODB);
    if (db) {
      console.log('database connected')
    } else {
      console.log('database error')
      return
    }
  } catch (error) {
    console.log(error)
    return
  }
})
