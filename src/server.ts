import app from "./app";
import { config } from "./config";
import { initializeDatabase } from "./db";

const startServer = async () => {
  try {
    initializeDatabase();
    app.listen(config.port, () => {
      console.log(`Server is running on http://localhost:${config.port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
};
startServer();
