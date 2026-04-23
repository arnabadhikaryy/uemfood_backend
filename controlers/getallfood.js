// /production/getallfood route code
import foodsmodel from "../Schema/foodsSchema.js";
import redisClient from "./radisClient.js";

async function getAllFoods(req, res) {
  try {
    const cacheKey = 'allFoods';

    // 1. Check if data exists in Redis cache
    const cachedFoods = await redisClient.get(cacheKey);

    if (cachedFoods) {
      // console.log('Cache hit');
      // 2. Cache hit: Return parsed data immediately
      return res.send({
        status: true,
        message: JSON.parse(cachedFoods),
        source: 'cache' // Optional: helpful for seeing where data came from in testing
      });
    }

    // 3. Cache miss: Fetch all food data from the database
    const result = await foodsmodel.find();

    // 4. Save the result to Redis for future requests
    // .setEx(key, expiration_in_seconds, value)
    // 3600 seconds = 1 hour. Adjust this based on how often your menu changes!


    // await redisClient.setEx(cacheKey, 3600, JSON.stringify(result));
    //console.log('Cache miss, data added to cache');
    // This will keep the data in Redis permanently
    await redisClient.set(cacheKey, JSON.stringify(result));

    
    // Respond with the data
    res.send({
      status: true,
      message: result,
      source: 'database'
    });
  } catch (error) {
    console.error("Error fetching foods data:", error);
    res.status(500).send({
      status: false,
      message: "Failed to retrieve food data",
      error: error.message,
    });
  }
}

export { getAllFoods };