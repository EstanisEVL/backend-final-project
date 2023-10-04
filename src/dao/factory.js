import { PERSISTENCE } from "../config/config.js";
import Connection from "../utils/connect.js";

export let Carts;
export let Products;
export let Users;

switch (PERSISTENCE) {
  case "MONGO":
    const mongoInstance = Connection.getInstance();
    const { default: UserServiceDao } = await import(
      "../dao/mongodb/user.mongo.js"
    );
    const { default: CartServiceDao } = await import(
      "../dao/mongodb/cart.mongo.js"
    );
    const { default: ProductServiceDao } = await import(
      "../dao/mongodb/product.mongo.js"
    );

    Carts = CartServiceDao;
    Products = ProductServiceDao;
    Users = UserServiceDao;
    break;
}
