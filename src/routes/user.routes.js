import { Router } from "express";
import {
  getUsers,
  deleteUsers,
  togglePremium,
  uploadDocuments,
} from "../controllers/user.controller.js";
import isValidMongoId from "../middlewares/validate-mongoId.middleware.js";
import handleUploads from "../middlewares/handle-uploads.middleware.js";

const router = Router();

// SOLO ADMIN. SE PUEDE LIMITAR DESDE LA VISTA QUE VA A SER ACCESIBLE SÓLO PARA EL ADMIN:
router.get("/", [], getUsers);

// SOLO ADMIN. SE PUEDE LIMITAR DESDE LA VISTA QUE VA A SER ACCESIBLE SÓLO PARA EL ADMIN:
router.get("/premium/:uid", [isValidMongoId("uid")], togglePremium);

router.post(
  "/:uid/documents",
  [isValidMongoId("uid"), handleUploads],
  uploadDocuments
);

// SOLO ADMIN. SE PUEDE LIMITAR DESDE LA VISTA QUE VA A SER ACCESIBLE SÓLO PARA EL ADMIN:
router.delete("/", [], deleteUsers);

export default router;
