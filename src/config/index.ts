import dotenv from "dotenv";

dotenv.config();

import { AppLogger as logger } from "../utils/logger";

export const NODE_ENV = process.env.NODE_ENV;
export const PORT = process.env.PORT;
export const APP_HOST = process.env.APP_HOST || "0.0.0.0";
export const SERVER_URI = process.env.SERVER_URI;
export const CLIENT_URI = process.env.CLIENT_URI;

export const DB_HOST = process.env.DB_HOST;
export const DB_NAME = process.env.DB_NAME;
export const DB_USER = process.env.DB_USER;
export const DB_PASSWORD = process.env.DB_PASSWORD;

if (!DB_HOST || !DB_NAME || !DB_USER || !DB_PASSWORD)
  logger.error("[ENV] Missing required env variables for database");
