import redis from 'redis';

const client = redis.createClient({
  url: process.env.REDIS_URL,
});

client
  .connect()
  .then(() => {
    console.log('✅ Connected to Redis');
  })
  .catch((err) => {
    console.error('❌ Redis connection failed');
  });

export default client;
