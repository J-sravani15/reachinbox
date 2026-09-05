import IORedis from "ioredis";

export const redisConnection = new IORedis({
  host: "localhost",
  port: 6379,
  maxRetriesPerRequest: null,
});

redisConnection.on("connect", () => {
  console.log("✅ Redis Connected");
});

redisConnection.on("error", (err) => {
  console.error("❌ Redis Error:", err);
});