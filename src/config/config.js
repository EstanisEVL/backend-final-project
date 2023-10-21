import { config } from "dotenv";

config({
  path: `./.env.${process.env.NODE_ENV || "development"}.local`,
});

export const {
  API_VERSION,
  NODE_ENV,
  PORT,
  PERSISTENCE,
  MONGO_URL,
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  SECRET_JWT,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  GITHUB_CALLBACK_URL,
  EMAIL,
  EMAIL_PASSWORD,
  BASE_API_URL,
  RESET_URL,
  SESSION_ROUTES,
  USER_ROUTES,
  CART_ROUTES,
  PRODUCT_ROUTES,
} = process.env;
