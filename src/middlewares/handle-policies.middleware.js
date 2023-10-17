import passport from "passport";

export const handlePolicies = (policies) => {
  return (req, res, next) => {
    if (policies.length === 1 && policies[0] === "PUBLIC") {
      return next();
    }

    passport.authenticate("jwt", { session: false }, (err, userJWT, info) => {
      if (err) return next(err);

      if (!userJWT) {
        return res
          .status(401)
          .json({ message: "Access denied - invalid or expired token." });
      }

      if (policies.includes(userJWT.user.role.toUpperCase())) {
        
        req.user = userJWT;
        return next();
      } else {
        return res
          .status(403)
          .json({ message: "Access denied - Unauthorized role." });
      }
    })(req, res, next);
  };
};