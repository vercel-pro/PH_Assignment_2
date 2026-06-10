import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.join(process.cwd(), ".env"),
});

export const config = {
  port: process.env.PORT || 9000,
  connectionString: process.env.CONNECTION_STRING as string,
  accessSecret: process.env.JWT_ACCESS_SECRET as string,
};
