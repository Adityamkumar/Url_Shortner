import "dotenv/config";
import app from "./app.js";
import connectDB from "./db/db.js";
const PORT = Number(process.env.PORT) || 6000;


const startServer = async () => {
  await connectDB();
  app.listen(PORT,"0.0.0.0", () => console.log(`Server running on PORT: ${PORT}`));
};

startServer();
