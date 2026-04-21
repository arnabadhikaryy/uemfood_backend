
// redisClient.js
import { createClient } from 'redis';
import 'dotenv/config';

const redisClient = createClient({
  url: process.env.REDIS_URL
});

// Listen for errors to prevent app crashes if Redis goes down
redisClient.on('error', (err) => console.error('Redis Client Error:', err));

export default redisClient;