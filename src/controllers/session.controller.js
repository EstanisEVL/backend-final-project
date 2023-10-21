import { ADMIN_EMAIL, ADMIN_PASSWORD } from "../config/config.js";
import AdminDTO from "../dtos/admin.dto.js";
import AuthDTO from "../dtos/auth.dto.js";
import CartDTO from "../dtos/cart.dto.js";
import ProductDTO from "../dtos/product.dto.js";
import UserDTO from "../dtos/user.dto.js";
import { sendRecoveryMail } from "../helpers/email.helper.js";
import {
  CartService,
  ProductService,
  UserService,
} from "../repositories/index.js";
import { createHashValue, isValidPwd } from "../utils/encrypt.js";
import { generateJwt } from "../utils/jwt.js";

export const registerUser = async (req, res) => {
  try {
    const { first_name, last_name, email, age, password } = req.body;

    const checkUser = await UserService.findUser(email);

    if (checkUser) {
      return res.status(400).json({ message: "Error - User already exists." });
    } else {
      const hashedPwd = createHashValue(password);

      const userInfo = {
        first_name,
        last_name,
        email,
        age,
        password: hashedPwd,
      };

      const newUser = await UserService.createUser(userInfo);
      const user = new UserDTO(newUser);

      return res.status(201).redirect("/login");
    }
  } catch (err) {
    req.logger.error(err);

    return res.status(500).json({
      message: "Server side error - in registerUser - session.controller.js",
    });
  }
};

export const recoverPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const checkUser = await UserService.findUser(email);

    if (!checkUser) {
      return res.status(404).redirect("/register");
    } else {
      sendRecoveryMail(checkUser);

      return res.status(200).render("success", {
        style: "styles.css",
        email: email,
      });
    }
  } catch (err) {
    req.logger.error(err);
    return res.status(500).json({
      message: "Server side error - in recoverPassword - session.controller.js",
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    const hashedPwd = createHashValue(password);

    const checkUser = await UserService.findUser(email);

    if (!checkUser) {
      return res.status(404).redirect("/register");
    } else {
      const isValidComparePwd = isValidPwd(password, checkUser.password);

      if (!isValidComparePwd) {
        const updatedUser = await UserService.updateUser(email, hashedPwd);
        return res.status(200).redirect("/login");
      } else {
        return res.status(400).json({
          message: "Error - Password cannot be the same as the existing one.",
        });
      }
    }
  } catch (err) {
    req.logger.error(err);
    return res.status(500).json({
      message: "Server side error - in resetPassword - session.controller.js",
    });
  }
};

export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = {
      first_name: "Admin",
      last_name: "CODER",
      email: ADMIN_EMAIL,
      age: "-",
      password: ADMIN_PASSWORD,
      role: "admin",
    };

    if (req.body.email !== admin.email) {
      const checkUser = await UserService.findUser(email);

      if (!checkUser) {
        return res.status(404).redirect("/register");
      } else {
        const isValidComparePwd = isValidPwd(password, checkUser.password);

        if (!isValidComparePwd) {
          return res.status(401).redirect("/register");
        } else {
          if (checkUser.carts.length === 0) {
            const newCart = new CartDTO();
            const cart = await CartService.createCart(newCart);
            const createdCart = await CartService.getCartById(String(cart._id));

            checkUser.carts.push(createdCart);

            const lastConnection = new Date();
            checkUser.last_connection = lastConnection;

            await checkUser.save();

            const signUser = {
              first_name: checkUser.first_name,
              last_name: checkUser.last_name,
              email,
              age: checkUser.age,
              role: checkUser.role,
              id: String(checkUser._id),
              carts: createdCart,
              documents: checkUser.documents,
              last_connection: checkUser.last_connection,
            };

            const token = await generateJwt({ ...signUser });
            req.user = { ...signUser };
            const user = new UserDTO(req.user);

            let productsInCart = [];

            if (user.userCarts.products.length > 0) {
              const updatedProductsInCart = user.userCarts.products.map(
                (prod) =>
                  new ProductDTO(prod.product, user.userCarts._id.toHexString())
              );

              productsInCart = updatedProductsInCart;
            }

            const docs = await ProductService.getAllProducts();
            const filteredDocs = docs.filter((prod) => prod.owner !== user.id);
            const productsRender = filteredDocs.map(
              (prod) => new ProductDTO(prod, user.userCarts._id.toHexString())
            );
            let totalProductsQuantity = user.userCarts.products.reduce((total, prod) => total + prod.quantity, 0);
            let totalProductsPrice = user.userCarts.products.reduce((total, prod) => total + prod.quantity * prod.product.price , 0);

            return res
              .status(200)
              .cookie("Cookie", token, {
                maxAge: 60 * 60 * 1000,
                httpOnly: true,
              })
              .render("profile", {
                style: "styles.css",
                first_name: user.name,
                age: user.age,
                email: user.email,
                role: user.role,
                cid: String(createdCart._id),
                carts: user.userCarts,
                productsTitle:
                  productsInCart.length === 0 || !user.userCarts
                    ? "El carrito está vacío"
                    : "Productos en el carrito:",
                productsInCart: productsInCart,
                products: productsRender,
                totalProducts: totalProductsQuantity,
                fullPrice: totalProductsPrice,
              });
          } else {
            const userCart = checkUser.carts.map((cart) => {
              return String(cart._id);
            });

            const cart = await CartService.getCartById(String(userCart[0]));

            const lastConnection = new Date();
            checkUser.last_connection = lastConnection;

            await checkUser.save();

            const signUser = {
              first_name: checkUser.first_name,
              last_name: checkUser.last_name,
              email,
              age: checkUser.age,
              role: checkUser.role,
              id: String(checkUser._id),
              carts: cart,
              documents: checkUser.documents,
              last_connection: checkUser.last_connection,
            };
            const token = await generateJwt({ ...signUser });
            req.user = { ...signUser };
            const user = new UserDTO(req.user);

            let productsInCart = [];

            if (user.userCarts.products.length > 0) {
              const updatedProductsInCart = user.userCarts.products.map(
                (prod) =>
                  new ProductDTO(prod.product, user.userCarts._id.toHexString())
              );

              productsInCart = updatedProductsInCart;
            }

            const docs = await ProductService.getAllProducts();
            const filteredDocs = docs.filter((prod) => prod.owner !== user.id);
            const productsRender = filteredDocs.map(
              (prod) => new ProductDTO(prod, user.userCarts._id.toHexString())
            );
            let totalProductsQuantity = user.userCarts.products.reduce((total, prod) => total + prod.quantity, 0);
            let totalProductsPrice = user.userCarts.products.reduce((total, prod) => total + prod.quantity * prod.product.price , 0);

            return res
              .status(200)
              .cookie("Cookie", token, {
                maxAge: 60 * 60 * 1000,
                httpOnly: true,
              })
              .render("profile", {
                style: "styles.css",
                first_name: user.name,
                age: user.age,
                email: user.email,
                role: user.role,
                cid: String(cart._id),
                carts: user.userCarts,
                productsTitle:
                  productsInCart.length === 0 || !user.userCarts
                    ? "El carrito está vacío"
                    : "Productos en el carrito:",
                productsInCart: productsInCart,
                products: productsRender,
                totalProducts: totalProductsQuantity,
                fullPrice: totalProductsPrice,
              });
          }
        }
      }
    } else {
      const adminDTO = new AdminDTO(admin);
      const token = await generateJwt({ ...adminDTO });

      const users = await UserService.getUsers();
      const usersRender = users.map((user) => new UserDTO(user));

      return res
        .status(200)
        .cookie("Cookie", token, { maxAge: 60 * 60 * 1000, httpOnly: true })
        .render("admin", {
          style: "styles.css",
          first_name: adminDTO.fullName,
          age: adminDTO.age,
          email: adminDTO.email,
          role: adminDTO.role,
          users: usersRender,
        });
    }
  } catch (err) {
    req.logger.error(err);
    return res.status(500).json({
      message: "Server side error - in userLogin - session.controller.js",
    });
  }
};

export const userLogout = async (req, res) => {
  try {
    res.clearCookie("Cookie");
    return res.status(200).redirect("/login");
  } catch (err) {
    req.logger.error(err);
    return res.status(500).json({
      message: "Server side error - in userLogout - session.controller.js",
    });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const auth = new AuthDTO(req.user);
    return res.status(200).json({
      message: `Current user - ${auth.email} || Role - ${auth.role}.`,
    });
  } catch (err) {
    req.logger.error(err);
    return res.status(500).json({
      message: "Server side error - in getCurrentUser - session.controller.js",
    });
  }
};

export const githubLogin = async (req, res) => {
  try {
    req.logger.info("Log in with GitHub.");
  } catch (err) {
    req.logger.error(err);
    return res.status(500).json({
      message: "Server side error - in githubLogin - session.controller.js",
    });
  }
};

export const getGithubUser = async (req, res) => {
  try {
    const githubUser = req.user;

    if (githubUser.carts.length === 0) {
      const newCart = new CartDTO();
      const cart = await CartService.createCart(newCart);
      const createdCart = await CartService.getCartById(String(cart._id));
      githubUser.carts.push(createdCart);

      const lastConnection = new Date();
      githubUser.last_connection = lastConnection;

      await githubUser.save();

      const signUser = {
        first_name: githubUser.first_name,
        last_name: githubUser.last_name,
        email: githubUser.email,
        age: githubUser.age,
        role: githubUser.role,
        id: String(githubUser._id),
        carts: createdCart,
        documents: githubUser.documents,
        last_connection: githubUser.last_connection,
      };

      const token = await generateJwt({ ...signUser });
      req.user = { ...signUser };
      const user = new UserDTO(req.user);

      return res
        .status(200)
        .cookie("Cookie", token, {
          maxAge: 60 * 60 * 1000,
          httpOnly: true,
        })
        .redirect(`/profile?user=${user.email}`);
    } else {
      const cart = githubUser.carts.map((cart) => String(cart._id));
      const findCart = await CartService.getCartById(String(cart));

      const lastConnection = new Date();
      githubUser.last_connection = lastConnection;

      await githubUser.save();

      const signUser = {
        first_name: githubUser.first_name,
        last_name: githubUser.last_name,
        email: githubUser.email,
        age: githubUser.age,
        role: githubUser.role,
        id: String(githubUser._id),
        carts: findCart,
        documents: githubUser.documents,
        last_connection: githubUser.last_connection,
      };

      const token = await generateJwt({ ...signUser });
      req.user = { ...signUser };
      const user = new UserDTO(req.user);

      return res
        .status(200)
        .cookie("Cookie", token, {
          maxAge: 60 * 60 * 1000,
          httpOnly: true,
        })
        .redirect(`/profile?user=${user.email}`);
    }
  } catch (err) {
    req.logger.error(err);
    return res.status(500).json({
      message: "Server side error - in getGithubUser - session.controller.js",
    });
  }
};
