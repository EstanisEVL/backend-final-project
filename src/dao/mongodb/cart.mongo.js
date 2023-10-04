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

  updateById = async (cid, cartBody) => {
    try {
      const updatedCart = await cartModel.findOneAndUpdate(
        { _id: cid },
        { $set: cartBody }
      );
      return updatedCart;
    } catch (err) {
      return err;
    }
  };

  // REVISAR CON CORRECCIONES
  getAndUpdateById = async (cid, pid, updatedProductBody) => {
    try {
      // const cart = getByIdAndUpdate(cid, pid, {
      //   category: updatedProductBody.category,
      // });

      const cart = await cartModel.findById({ _id: cid });
      // const product = cart.products.find()
      return cart;
    } catch (err) {
      return err;
    }
  };

  deleteById = async (cid) => {
    try {
      const cart = await cartModel.deleteOne({ _id: cid });
      return cart;
    } catch (err) {
      return err;
    }
  };
}
