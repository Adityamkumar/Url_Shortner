import app from "./app.js";
import connectDB from "./db/db.js";
import { configDotenv } from "dotenv";
import {connectRedis} from "./utils/redisClient.js";

configDotenv();

connectDB();
const PORT = process.env.PORT;

const startServer = async () => {
  await connectRedis() //connect redis
  app.listen(PORT, () => console.log(`Server is Running ✅ on PORT: ${PORT} `));
};

startServer()