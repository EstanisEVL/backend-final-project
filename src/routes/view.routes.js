import { Router } from "express";
import {
  home,
  login,
  register,
  recover,
  reset,
  profile,
  admin,
} from "../controllers/view.controller.js";
import verifyToken from "../middlewares/verify-token.middleware.js";

const router = Router();

router.get("/", home);

router.get("/login", login);

router.get("/register", register);

router.get("/recover", recover);

router.get("/reset/:token", [verifyToken], reset);

router.get("/profile", profile);

router.get("/admin", admin);

export default router;
