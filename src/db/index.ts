import { Pool } from "pg";
import { config } from "../config";

export const pool = new Pool({
  connectionString: config.connectionString,
});

export const initializeDatabase = async () => {
  try {
    // Create users table if it doesn't exist
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role VARCHAR(20) DEFAULT 'contributor' CHECK (role IN ('contributor', 'maintainer')) NOT NULL,

            createdAt TIMESTAMP DEFAULT NOW(),
            updatedAt TIMESTAMP DEFAULT NOW()
        )
    `);

    // Create Issues table if it doesn't exist
    await pool.query(`
        CREATE TABLE IF NOT EXISTS issues (
            id SERIAL PRIMARY KEY,
            title VARCHAR(150) NOT NULL,
            description TEXT CHECK(LENGTH(description) >= 20) NOT NULL,
            type VARCHAR(20) CHECK (type IN ('bug', 'feature_request')) NOT NULL,
            status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved')) NOT NULL,
            reporter_id INTEGER NOT NULL,
            
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
        )
    `);

    console.log("Database connected successfully.");
  } catch (error) {
    console.error("Error initializing database:", error);
  }
};
