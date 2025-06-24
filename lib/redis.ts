import { createClient } from 'redis';

let redisClient: ReturnType<typeof createClient> | null = null;

const getRedisClient = () => {
  if (!redisClient) {
    if (!process.env.REDIS_URL) {
      throw new Error('REDIS_URL environment variable is not set.');
    }
    
    redisClient = createClient({
      url: process.env.REDIS_URL,
    });

    redisClient.on('error', (err) => console.error('Redis Client Error', err));

    // The client needs to be connected to be used.
    // We will connect where it's used to avoid top-level awaits or blocking the server start.
  }
  return redisClient;
};

export default getRedisClient; 