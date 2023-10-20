import { sendDeletedProductMail } from "../helpers/email.helper.js";
import { ProductService, UserService } from "../repositories/index.js";

export const getProducts = async (req, res) => {
  try {
    const products = await ProductService.getAllProducts();

    return res.status(200).json({ message: "Products - ", products });
  } catch (err) {
    req.logger.error(err);

    return res.status(500).json({
      message: "Server side error - in getProducts - product.controller.js",
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { pid } = req.params;

    const product = await ProductService.getProduct(null, pid);

    if (!product) {
      return res.status(404).json({ message: "Error - Product not found." });
    } else {
      return res.status(200).json({ message: "Product found - ", product });
    }
  } catch (err) {
    req.logger.error(err);

    return res.status(500).json({
      message: "Server side error - in getProductById - product.controller.js",
    });
  }
};

export const createProduct = async (req, res) => {
  try {
    const product = req.body;

    const checkProduct = await ProductService.getProduct(product.code, null);
    if (!checkProduct) {
      if (req.user.user.role.toLowerCase() !== "admin") {
        const findUser = await UserService.findUser(null, req.user.user.id);

        const newProduct = { ...product, owner: req.user.user.id };
        const productBody = await ProductService.createProduct(newProduct);
        return res
          .status(201)
          .json({ message: "Product created - ", productBody });
      } else {
        const productBody = await ProductService.createProduct(product);
        return res
          .status(201)
          .json({ message: "Product created - ", productBody });
      }
    } else {
      return res.status(400).json({
        message:
          "Error - Product already exists. Please update product if you want to modify its values.",
      });
    }
  } catch (err) {
    req.logger.error(err);

    return res.status(500).json({
      message: "Server side error - in createProduct - product.controller.js",
    });
  }
};

export const updateProductById = async (req, res) => {
  try {
    const { pid } = req.params;
    const productBody = req.body;

    const updatedProduct = await ProductService.updateProduct(pid, productBody);

    if (!updatedProduct) {
      return res.status(404).json({ message: "Error - Product not found." });
    } else {
      return res.status(200).json({ message: "Product Updated - ", updatedProduct });
    }
  } catch (err) {
    req.logger.error(err);

    return res.status(500).json({
      message:
        "Server side error - in updateProductById - product.controller.js",
    });
  }
};

export const deleteProductById = async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await ProductService.getProduct(null, pid);

    if (!product) {
      return res.status(404).json({ message: "Error - Product not found." });
    } else {
      const findUser = await UserService.findUser(null, req.user.user.id);

      if (req.user.user.role.toLowerCase() === "premium") {
        if (product.owner !== String(findUser._id)) {
          return res.status(403).json({
            message:
              "Error - Premium users cannot delete products created by the admin.",
          });
        } else {
          const deletedProduct = await ProductService.deleteProduct(pid);

          sendDeletedProductMail(findUser.email);

          return res.status(200).json({
            message: "Product deleted - ",
            deletedProduct,
          });
        }
      }
      const deletedProduct = await ProductService.deleteProduct(pid);

      if (product.owner !== "admin") {
        const findOwner = await UserService.findUser(
          null,
          String(product.owner)
        );

        sendDeletedProductMail(findOwner.email);
      }

      return res.status(200).json({
        message: "Product deleted - ",
        deletedProduct,
      });
    }
  } catch (err) {
    req.logger.error(err);

    return res.status(500).json({
      message:
        "Server side error - in deleteProductById - product.controller.js",
    });
  }
};
