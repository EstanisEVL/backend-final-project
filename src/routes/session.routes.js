import { Router } from "express";
import {
  registerUser,
  recoverPassword,
  resetPassword,
  userLogin,
  userLogout,
  getCurrentUser,
  githubLogin,
  getGithubUser,
} from "../controllers/session.controller.js";
import { validateBodyFields, validateLogin, validateReset } from "../middlewares/validate-fields.middleware.js";
import { passportCall } from "../utils/jwt.js";

const router = Router();

router.post("/register", [validateBodyFields], registerUser);

router.post("/recover", recoverPassword);

router.post("/reset", [validateReset], resetPassword);

router.post("/login", [validateLogin], userLogin);

router.get("/logout", [passportCall("jwt")], userLogout);

router.get("/current", [passportCall("jwt")], getCurrentUser);

router.get("/github", [passportCall("github")], githubLogin);

router.get("/githubcallback", [passportCall("github")], getGithubUser);

export default router;
