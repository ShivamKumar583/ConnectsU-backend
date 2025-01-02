const Bull = require('bull')
const Redis = require('ioredis')

const redisOptions = {
    host : 'localhost',
    port: 6379
}

const messageQueue = new Bull('messageQueue', {redis:redisOptions})
messageQueue.on('ready', () => {
    console.log('Connected to Redis successfully.');
});

messageQueue.on('error', (err) => {
    console.error('Redis connection error:', err);
});

module.exports = messageQueue;