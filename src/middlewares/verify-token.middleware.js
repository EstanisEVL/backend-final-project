import jwt from "jsonwebtoken";
import { SECRET_JWT } from "../config/config.js";

const verifyToken = (req, res, next) => {
  const { token } = req.params;

  jwt.verify(token, SECRET_JWT, (err, decoded) => {
    if (err) {
      return res.redirect("/recover");
    } 

    next();
  });
};

export default verifyToken;
