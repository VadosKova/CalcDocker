const { createClient } = require("redis");

const redis = createClient({
  url: "redis://redis:6379"
});

redis.on("error", (err) => console.log("Redis Client Error", err));

(async () => {
  await redisClient.connect();
  console.log("Redis connected");
})();

module.exports = redis;