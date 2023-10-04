import productModel from "../../models/product.model.js";

export default class Products {
  get = async () => {
    try {
      const products = await productModel.find();
      return products;
    } catch (err) {
      return err;
    }
  };

  getById = async (pid) => {
    try {
      const product = await productModel.findById({ _id: pid });
      return product;
    } catch (err) {
      return err;
    }
  };

  getByCode = async (code) => {
    try {
      const product = await productModel.findOne({ code: code });
      return product;
    } catch (err) {
      return err;
    }
  };

  create = async (pBody) => {
    try {
      const product = await productModel.create(pBody);
      return product;
    } catch (err) {
      return err;
    }
  };

  update = async (pid, pBody) => {
    try {
      const product = await productModel.findByIdAndUpdate(pid, pBody, {new: true});
      return product;
    } catch (err) {
      return err;
    }
  };

  delete = async (pid) => {
    try {
      const product = await productModel.deleteOne({_id: pid});
      return product;
    } catch (err) {
      return err;
    }
  };
}
