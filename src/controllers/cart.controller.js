import {
  CartService,
  ProductService,
  TicketService,
} from "../repositories/index.js";
import CartDTO from "../dtos/cart.dto.js";
import TicketDTO from "../dtos/ticket.dto.js";
import { sendMail } from "../helpers/email.helper.js";

export const getCarts = async (req, res) => {
  try {
    const carts = await CartService.getCarts();
    return res.status(200).json({ message: "Carts in data base - ", carts });
  } catch (err) {
    req.logger.error(err);

    return res.status(500).json({
      message: "Server side error - in getCarts - cart.controller.js",
    });
  }
};

export const getCartById = async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await CartService.getCartById(cid);
    if (!cart) {
      return res.status(404).json({ message: "Error - Cart not found." });
    } else {
      return res.status(200).json({ message: "Cart - ", cart });
    }
  } catch (err) {
    req.logger.error(err);

    return res.status(500).json({
      message: "Server side error - in getCartById - cart.controller.js",
    });
  }
};

export const createCart = async (req, res) => {
  try {
    const newCart = new CartDTO();
    const cart = await CartService.createCart(newCart);
    return res.status(200).json({ message: "Created cart - ", cart });
  } catch (err) {
    req.logger.error(err);

    return res
      .status(500)
      .json({
        message: "Server side error - in createCart - cart.controller.js",
      });
  }
};

export const addProductToCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const product = await ProductService.getProduct(null, pid);

    if (!product) {
      return res.status(404).json({ message: "Error - Product not found." });
    } else {
      const cart = await CartService.getCartById(cid);

      if (!cart) {
        return res.status(404).json({ message: "Error - Cart not found." });
      } else {
        const productInCart = cart.products.find(
          (product) => String(product.product._id) === String(pid)
        );
        if (productInCart) {
          productInCart.quantity++;
          await cart.save();
          return res.status(200).json({ message: "Product quantity updated." });
        } else {
          const updatedCart = await CartService.addProductToCart(cid, pid);
          return res
            .status(200)
            .json({ message: "Product added to cart.", updatedCart });
        }
      }
    }
  } catch (err) {
    req.logger.error(err);

    return res
      .status(500)
      .json({
        message: "Server side error - in addProductToCart - cart.controller.js",
      });
  }
};

export const updateProductFromCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const updatedProduct = req.body;

    const cart = await CartService.getCartById(cid);

    if (!cart) {
      return res.status(404).json({ message: "Error - Cart not found." });
    } else {
      const product = cart.products.find(
        (prod) => String(prod.product._id) === String(pid)
      );

      if (!product) {
        return res
          .status(404)
          .json({ message: "Error - Product does not exist in cart." });
      } else {
        if (String(updatedProduct.operation).toLowerCase() === "add") {
          const updatedQuantity = updatedProduct.quantity;
          product.quantity += updatedQuantity;

          await cart.save();

          return res
            .status(200)
            .json({ message: "Product quantity succesfully updated." });
        } else if (
          String(updatedProduct.operation).toLowerCase() === "remove"
        ) {
          const updatedQuantity = updatedProduct.quantity;
          product.quantity -= updatedQuantity;
          if (product.quantity <= 0) {
            product.quantity = 1;

            await cart.save();

            return res
              .status(200)
              .json({ message: "Product quantity succesfully updated." });
          } else {
            await cart.save();

            return res
              .status(200)
              .json({ message: "Product quantity succesfully updated." });
          }
        } else {
          return res.status(400).json({
            message: "Error - Only add or remove operations are valid.",
          });
        }
      }
    }
  } catch (err) {
    req.logger.error(err);

    return res
      .status(500)
      .json({
        message:
          "Server side error - in updateProductFromCart - cart.controller.js",
      });
  }
};

export const deleteCartById = async (req, res) => {
  try {
    const { cid } = req.params;

    const cart = await CartService.getCartById(cid);

    if (!cart) {
      return res.status(404).json({ message: "Error - Cart not found." });
    } else {
      const deletedCart = await CartService.deleteCartById(cid);

      return res
        .status(200)
        .json({ message: "Cart successfully deleted." });
    }
  } catch (err) {
    req.logger.error(err);

    return res
      .status(500)
      .json({
        message: "Server side error - in deleteCartById - cart.controller.js",
      });
  }
};

export const deleteProductFromCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await CartService.getCartById(cid);
    if (!cart) {
      return res.status(404).json({ message: "Error - Cart not found." });
    } else {
      const productIndex = cart.products.findIndex(
        (prod) => String(prod.product._id) === String(pid)
      );
      if (productIndex === -1) {
        return res
          .status(404)
          .json({ message: "Error - Product does not exist in cart." });
      } else {
        const productInCart = cart.products.find(
          (prod) => String(prod.product._id) === String(pid)
        );
        if (productInCart && productInCart.quantity > 1) {
          productInCart.quantity--;

          await cart.save();

          return res.status(200).json({ message: "Product quantity updated." });
        } else {
          cart.products.splice(productIndex, 1);

          const updatedCart = await cart.save();

          return res
            .status(200)
            .json({ message: "Product deleted from cart.", updatedCart });
        }
      }
    }
  } catch (err) {
    req.logger.error(err);

    return res
      .status(500)
      .json({
        message:
          "Server side error - in deleteProductFromCart - cart.controller.js",
      });
  }
};

export const purchaseProducts = async (req, res) => {
  try {
    const { cid } = req.params;
    const userEmail = req.body;

    const cart = await CartService.getCartById(cid);
    if (!cart) {
      return res.status(404).json({ message: "Error - Cart not found." });
    } else {
      if (cart.products.length === 0) {
        return res.status(404).json({ message: "Error - Cart is empty." });
      } else {
        const productsToPurchase = cart.products;
        const productToUpdate = [];
        let fullPrice = 0;

        for (const product of productsToPurchase) {
          const pid = String(product.product._id);
          const productQuantity = Number(product.quantity);

          const productInStock = await ProductService.getProduct(null, pid);
          if (!productInStock) {
            return res
              .status(404)
              .json({ message: "Error - Product is not in stock." });
          } else {
            if (productQuantity > productInStock.stock) {
              return res.status(400).json({
                message: `Not enough stock of ${productInStock.title}`,
              });
            } else {
              fullPrice += productQuantity * productInStock.price;

              productToUpdate.push({
                pid: pid,
                quantity: productQuantity,
              });
            }
          }
        }

        const ticketData = new TicketDTO({
          purchase_datetime: new Date(),
          amount: fullPrice,
          purchaser: userEmail.email,
        });

        const newTicket = await TicketService.createTicket(ticketData);

        for (const product of productToUpdate) {
          const pid = product.pid;
          const productQuantity = Number(product.quantity);

          const productInStock = await ProductService.getProduct(null, pid);
          const newStock = Number(productInStock.stock) - productQuantity;

          await ProductService.updateProduct(pid, { stock: newStock });
        }

        sendMail(
          newTicket.purchaser,
          newTicket.amount,
          newTicket.purchase_datetime
        );

        cart.products = [];
        await cart.save();

        return res
          .status(200)
          .json({ message: "Purchase successfully completed." });
      }
    }
  } catch (err) {
    req.logger.error(err);

    return res
      .status(500)
      .json({
        message: "Server side error - in purchaseProducts - cart.controller.js",
      });
  }
};
