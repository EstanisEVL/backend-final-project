import { Router } from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProductById,
  deleteProductById,
} from "../controllers/product.controller.js";
import isValidMongoId from "../middlewares/validate-mongoId.middleware.js";
import { handlePolicies } from "../middlewares/handle-policies.middleware.js";
import { roles } from "../constants/roles.js";
import { validateProductCreation, validateProductUpdate } from "../middlewares/validate-fields.middleware.js";

const router = Router();

router.get("/", getProducts);

router.get("/:pid", [isValidMongoId("pid")], getProductById);

router.post("/", [handlePolicies([roles[0], roles[1]]), validateProductCreation], createProduct);

router.put(
  "/:pid",
  [isValidMongoId("pid"), handlePolicies(roles[0]), validateProductUpdate],
  updateProductById,
);

router.delete(
  "/:pid",
  [isValidMongoId("pid"), handlePolicies([roles[0], roles[1]])],
  deleteProductById
);

export default router;
