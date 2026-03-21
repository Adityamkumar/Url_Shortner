import app from "./app.js";
import connectDB from "./db/db.js";
import db from "./db/db.js";
import { configDotenv } from "dotenv";

configDotenv();

connectDB();
const PORT = process.env.PORT;

app.listen(PORT, () => console.log(`Server is Running ✅ on PORT: ${PORT} `));
