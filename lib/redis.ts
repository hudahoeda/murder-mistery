import { createClient } from 'redis';

let redisClient: ReturnType<typeof createClient>;
let isConnecting = false;
let connectionPromise: Promise<any> | null = null;

const connectToRedis = async () => {
  if (redisClient && redisClient.isOpen) {
    return redisClient;
  }

  if (isConnecting && connectionPromise) {
    await connectionPromise;
    return redisClient;
  }

  isConnecting = true;

  if (!process.env.REDIS_URL) {
    throw new Error('REDIS_URL environment variable is not set.');
  }

  redisClient = createClient({
    url: process.env.REDIS_URL,
  });

  redisClient.on('error', (err) => console.error('Redis Client Error', err));

  connectionPromise = redisClient.connect();
  await connectionPromise;
  
  isConnecting = false;
  connectionPromise = null;

  return redisClient;
};

export default connectToRedis; 