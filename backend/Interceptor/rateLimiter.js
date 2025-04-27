import { RateLimiterMemory } from 'rate-limiter-flexible';

const rateLimiter = new RateLimiterMemory({
  points: 8, // Number of allowed requests
  duration: 1, // Duration in seconds
});

export default rateLimiter;
