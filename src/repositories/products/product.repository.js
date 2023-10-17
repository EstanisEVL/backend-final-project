import ProductDTO from "../../dtos/product.dto.js";

export default class ProductRepository {
  constructor(dao) {
    this.dao = dao;
  }

  getAllProducts = async () => {
    try {
      const data = await this.dao.get();
      return data;
    } catch (err) {
      return err;
    }
  };

  // IDEA: UNIR MÉTODOS GETPRODUCTBYCODE Y BYID EN UNO SOLO:
  // SI NO FUNCIONA, SEPARAR
  getProduct = async (code = null, pid = null) => {
    if (code !== null) {
      try {
        const data = await this.dao.getByCode(code);
        return data;
      } catch (err) {
        return err;
      }
    } else {
      try {
        const data = await this.dao.getById(pid);
        return data;
      } catch (err) {
        return err;
      }
    }
  };

  createProduct = async (product) => {
    try {
      const newProduct = new ProductDTO(product);
      const data = await this.dao.create(newProduct);
      return data;
    } catch (err) {
      return err;
    }
  };

  updateProduct = async (pid, pBody) => {
    try {
      const data = await this.dao.update(pid, pBody);
      return data;
    } catch (err) {
      return err;
    }
  };

  deleteProduct = async (pid) => {
    try {
      const data = await this.dao.delete(pid);
      return data;
    } catch (err) {
      return err;
    }
  };
}
