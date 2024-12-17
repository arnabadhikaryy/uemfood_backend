import { generatedTranscId } from "../static/generatedTranscId.js";
import axios from "axios";
import crypto from "crypto";
//import { console } from "inspector";
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import User from "../Schema/userSchema.js";


const MERCHANT_KEY="96434309-7796-489d-8924-ab56988a6076"
const MERCHANT_ID="PGTESTPAYUAT86"
let token = '';
let foodID='';
let userID='';

// const prod_URL = "https://api.phonepe.com/apis/hermes/pg/v1/pay"
// const prod_URL = "https://api.phonepe.com/apis/hermes/pg/v1/status"

const MERCHANT_BASE_URL="https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay"

const redirectUrl="http://localhost:3000/api/v1/orders/Payment-response"

const successUrl="http://localhost:5173/food/order"
const failureUrl="https://localhost:5173"


async function PAY(req, res) {
  

  const {name, amount, FOODorderID} = req.body;
  token=req.body.token;
  foodID=FOODorderID;

  if(!token){
    console.log('token not found')
    return res.send({status:true,message:'token not found'});
  }
    const secretKey = process.env.JWT_SECRET || 'your_secret_key';
    const decoded = jwt.verify(token, secretKey);
    console.log('token decode value is[payment.js] ',decoded)
    token=decoded.phone;
    userID=decoded.userId;

    //console.log('name ',name,'phone number ',mobileNumber,'amounr ',amount,'food id ',foodID,token)

  const orderId = uuidv4()

  //payment
  const paymentPayload = {
      merchantId : MERCHANT_ID,
      merchantUserId: name,
      mobileNumber: token,
      productINFO:'i am arnab adhikary..., ab bol salo',
      amount : amount * 100,
      merchantTransactionId: orderId,
      redirectUrl: `${redirectUrl}/?id=${orderId}`,
      redirectMode: 'POST',
      paymentInstrument: {
          type: 'PAY_PAGE'
      }
  }

  const payload = Buffer.from(JSON.stringify(paymentPayload)).toString('base64')
  const keyIndex = 1
  const string  = payload + '/pg/v1/pay' + MERCHANT_KEY
  const base_sha256_hash = crypto.createHash('sha256').update(string).digest('hex')
  const checksum = base_sha256_hash + '###' + keyIndex

  const option = {
      method: 'POST',
      url:MERCHANT_BASE_URL,
      headers: {
          accept : 'application/json',
          'Content-Type': 'application/json',
          'X-VERIFY': checksum
      },
      data :{
          request : payload
      }
  }
  try {
      
      const response = await axios.request(option);
      console.log(response.data.data.instrumentResponse.redirectInfo.url)
       res.status(200).json({msg : "OK", url: response.data.data.instrumentResponse.redirectInfo.url})
  } catch (error) {
      console.log("error in payment", error)
      res.status(500).json({error : 'Failed to initiate payment'})
  }
}

////////////////////////////////////////////////////////

const MERCHANT_STATUS_URL="https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status"

 function Payment_response(req, res) {
  
  const merchantTransactionId = req.query.id;
  console.log('merchendTrangectionID is ',merchantTransactionId);

  const keyIndex = 1
  const string  = `/pg/v1/status/${MERCHANT_ID}/${merchantTransactionId}` + MERCHANT_KEY
  const sha256 = crypto.createHash('sha256').update(string).digest('hex')
  const checksum = sha256 + '###' + keyIndex

  const option = {
      method: 'GET',
      url:`${MERCHANT_STATUS_URL}/${MERCHANT_ID}/${merchantTransactionId}`,
      headers: {
          accept : 'application/json',
          'Content-Type': 'application/json',
          'X-VERIFY': checksum,
          'X-MERCHANT-ID': MERCHANT_ID
      },
  }

  axios.request(option).then(async (response) => {
      if (response.data.success === true){
        console.log('payment responce is ',response.data,'token:',token,' food id is:', foodID,"userid is: ",userID);
        try {
            
             // Find user and update the orders array with the new orderID
        const result = await User.updateOne(
            { phone_number: token },
            { $push: { orders: foodID } }
        );
            console.log(result)
            
        } catch (error) {
            console.log(error);
        }
          return res.redirect(successUrl)
      }else{
          return res.redirect(failureUrl)
      }
  })
}

export { PAY, Payment_response };
