const Bull = require('bull')
const Redis = require('ioredis')

const redisOptions = process.env.REDIS_URL
  ? { url: process.env.REDIS_URL } // Use Redis URL for Render
  : {
      host: process.env.REDIS_HOST || 'localhost',  // Use 'localhost' for local Docker development
      port: process.env.REDIS_PORT || 6379,         // Default Redis port (6379)
    };

const messageQueue = new Bull('messageQueue', {redis:redisOptions})
messageQueue.on('ready', () => {
    console.log('Connected to Redis successfully.');
});

messageQueue.on('error', (err) => {
    console.error('Redis connection error:', err);
});

module.exports = messageQueue;