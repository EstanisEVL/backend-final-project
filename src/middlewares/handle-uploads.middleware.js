import multer from "multer";
import __dirname from "../utils.js";

const handleUploads = (req, res, next) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      let folder = "documents";
      if (String(req.body.type).toLowerCase() === "profileimg") {
        folder = "profiles";
        cb(null, `${__dirname}/public/uploads/${folder}`);
      } else if (String(req.body.type).toLowerCase() === "productimg") {
        folder = "products";
        cb(null, `${__dirname}/public/uploads/${folder}`);
      } else if (String(req.body.type).toLowerCase() === "document") {
        folder = "documents";
        cb(null, `${__dirname}/public/uploads/${folder}`);
      } else {
        return res
          .status(400)
          .json({ message: "Error - Invalid file type." });
      }
    },
    filename: (req, file, cb) => {
      const code = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      cb(null, `${code}-${file.originalname}`);
    },
  });

  const uploader = multer({ storage });

  uploader.array("documents")(req, res, (err) => {
    if (err) {
      return res.status(500).json({ message: "Uploader Error - ", err });
    }
    next();
  });
};

export default handleUploads;
