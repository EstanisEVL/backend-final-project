import { isValidObjectId } from "mongoose";

const isValidMongoId = (paramsId) => {
  return (req, res, next) => {
    const urlId = req.params[`${paramsId}`];

    if (!isValidObjectId(urlId)) {
      return res
        .status(400)
        .json({ message: `Error - ${urlId} is not a valid Mongo Id.` });
    }

    next();
  };
};

export default isValidMongoId;
