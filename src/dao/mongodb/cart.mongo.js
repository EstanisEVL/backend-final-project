import cartModel from "../../models/cart.model.js";

export default class Carts {
  get = async () => {
    try {
      const carts = await cartModel.find();
      return carts;
    } catch (err) {
      return err;
    }
  };

  getById = async (cid) => {
    try {
      const cart = await cartModel.findById({ _id: cid }).populate({
        path: "products.product",
        ref: "Products",
      });
      return cart;
    } catch (err) {
      return err;
    }
  };

  create = async (cart) => {
    try {
      const createdCart = await cartModel.create(cart);
      return createdCart;
    } catch (err) {
      return err;
    }
  };

  delete = async (cid) => {
    try {
      const cart = await cartModel.deleteOne({ _id: cid });
      return cart;
    } catch (err) {
      return err;
    }
  };
}
