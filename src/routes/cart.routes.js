import { Router } from "express";
import {
  getCarts,
  getCartById,
  createCart,
  addProductToCart,
  updateProductFromCart,
  purchaseProducts,
  deleteCartById,
  deleteProductFromCart,
} from "../controllers/cart.controller.js";
import { handlePolicies } from "../middlewares/handle-policies.middleware.js";
import isValidMongoId from "../middlewares/validate-mongoId.middleware.js";
import { validateProductInCartUpdate } from "../middlewares/validate-fields.middleware.js";
import { roles } from "../constants/roles.js";

const router = Router();

router.get("/", [handlePolicies([roles[0]])], getCarts);

router.get("/:cid", [isValidMongoId("cid")], getCartById);

router.post("/", createCart);

router.post(
  "/:cid/products/:pid",
  [
    isValidMongoId("cid"),
    isValidMongoId("pid"),
    handlePolicies([roles[1], roles[2]]),
  ],
  addProductToCart
);

router.put(
  "/:cid/products/:pid",
  [isValidMongoId("cid"), isValidMongoId("pid"), validateProductInCartUpdate],
  updateProductFromCart
);

router.delete(
  "/:cid",
  [isValidMongoId("cid"), handlePolicies([roles[0]])],
  deleteCartById
);

router.delete(
  "/:cid/products/:pid",
  [isValidMongoId("cid"), isValidMongoId("pid")],
  deleteProductFromCart
);

router.post("/:cid/purchase", [isValidMongoId("cid")], purchaseProducts);

export default router;
