import { CartService, ProductService, UserService } from "../repositories/index.js";
import ProductDTO from "../dtos/product.dto.js";

export const home = async (req, res) => {
  try {
    res.redirect("/login");
  } catch (err) {
    req.logger.error(err);

    return res.status(500).json({
      message: "Server side error - in home - view.controller.js",
    });
  }
};

export const login = async (req, res) => {
  try {
    res.render("login", { style: "styles.css" });
  } catch (err) {
    req.logger.error(err);

    return res.status(500).json({
      message: "Server side error - in login - view.controller.js",
    });
  }
};

export const register = async (req, res) => {
  try {
    res.render("register", { style: "styles.css" });
  } catch (err) {
    req.logger.error(err);

    return res.status(500).json({
      message: "Server side error - in register - view.controller.js",
    });
  }
};

export const recover = async (req, res) => {
  try {
    res.render("recover", { style: "styles.css" });
  } catch (err) {
    req.logger.error(err);

    return res.status(500).json({
      message: "Server side error - in recover - view.controller.js",
    });
  }
};

export const reset = async (req, res) => {
  try {
    res.render("reset", { style: "styles.css" });
  } catch (err) {
    req.logger.error(err);

    return res.status(500).json({
      message: "Server side error - in reset - view.controller.js",
    });
  }
};

export const profile = async (req, res) => {
  try {
    const githubUser = req.query;
    const user = await UserService.findUser(githubUser.user);
    const cart = user.carts.map((cart) => String(cart._id));
    const findCart = await CartService.getCartById(String(cart));

    let productsInCart = [];

    if (findCart.products.length > 0) {
      const updatedProductsInCart = findCart.products.map(
        (prod) => new ProductDTO(prod.product, findCart._id.toHexString())
      );
      productsInCart = updatedProductsInCart;
    }

    const docs = await ProductService.getAllProducts();
    const filteredDocs = docs.filter((prod) => prod.owner !== user.id);
    const productsRender = filteredDocs.map(
      (prod) => new ProductDTO(prod, findCart._id.toHexString())
    );

    res.status(200).render("profile", {
      style: "styles.css",
      user: user,
      first_name: user.first_name,
      age: user.age || "-",
      email: user.email,
      role: user.role,
      cid: String(findCart._id),
      carts: findCart,
      productsTitle:
        productsInCart.length === 0 || !findCart
          ? "El carrito está vacío"
          : "Productos en el carrito:",
      productsInCart: productsInCart,
      products: productsRender,
    });
  } catch (err) {
    req.logger.error(err);

    return res.status(500).json({
      message: "Server side error - in profile - view.controller.js",
    });
  }
};

export const admin = async (req, res) => {
  try {
    const user = req - session.user;
    res.status(200).render("admin", { style: "styles.css", user });
  } catch (err) {
    req.logger.error(err);

    return res.status(500).json({
      message: "Server side error - in admin - view.controller.js",
    });
  }
};
