import passport from "passport";
import jwt from "passport-jwt";
import GitHubStrategy from "passport-github2";
import {
  SECRET_JWT,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  GITHUB_CALLBACK_URL,
} from "./config.js";
import { cookieExtractor } from "../utils/jwt.js";
import { UserService } from "../repositories/index.js";
import userModel from "../models/user.model.js";

const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

const initializePassport = () => {
  passport.use(
    "jwt",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: SECRET_JWT,
      },
      async (jwt_payload, done) => {
        try {
          return done(null, jwt_payload);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: GITHUB_CLIENT_ID,
        clientSecret: GITHUB_CLIENT_SECRET,
        callbackURL: GITHUB_CALLBACK_URL,
      },
      async (accesToken, refreshToken, profile, done) => {
        try {
          const user = await UserService.findUser(profile._json.email);
          console.log(user);
          if (!user) {
            let addNewUser = {
              first_name: profile._json.login,
              last_name: "",
              email: profile._json.email,
              age: null,
              password: "",
            };
            let newUser = await userModel.create(addNewUser);
            done(null, newUser);
          } else {
            done(null, user);
          }
        } catch (err) {
          return done(err);
        }
      }
    )
  );
};

export default initializePassport;
