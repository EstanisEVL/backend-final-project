import mongoose from "mongoose";
import { expect } from "chai";
import { MONGO_URL } from "../../../src/config/config.js";
import Carts from "../../../src/dao/mongodb/cart.mongo.js";
import CartDTO from "../../../src/dtos/cart.dto.js";

describe("Should test Cart dao methods.", () => {
  let cartDao;

  before(async () => {
    await mongoose.connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  after(async () => {
    await mongoose.connection.close();
  });

  beforeEach(() => {
    cartDao = new Carts();
  });

  it("Should GET all carts in data base", async () => {
    const carts = await cartDao.get();

    expect(carts).to.be.an("array");
  });

  it("Should GET a cart by its ID in data base and check its properties", async () => {
    // Crear carrito:
    const cartDto = new CartDTO();
    const newCart = await cartDao.create(cartDto);

    expect(newCart).to.have.property("_id");

    // Buscar carrito recién creado por su id:
    const cid = String(newCart._id);

    const cart = await cartDao.getById(cid);

    expect(cart).to.be.an("object");

    // Borrar carrito:
    await cartDao.delete(cid);
  });

  it("Should successfully CREATE a cart and check its properties", async () => {
    // Crear carrito:
    const cartDto = new CartDTO();
    const newCart = await cartDao.create(cartDto);

    expect(newCart).to.be.an("object");
    expect(newCart).to.have.property("_id");
    expect(newCart).to.have.property("products");
    expect(newCart.products).to.be.an("array");

    // Borrar carrito:
    const cid = String(newCart._id);

    await cartDao.delete(cid);
  });

  it("Should successfully DELETE a cart by its id", async () => {
    // Crear carrito:
    const cartDto = new CartDTO();
    const newCart = await cartDao.create(cartDto);
    expect(newCart).to.have.property("_id");

    // Borrar carrito:
    const cid = String(newCart._id);

    await cartDao.delete(cid);

    // Buscar carrito:
    const checkCart = await cartDao.getById(cid);
    expect(checkCart).to.equal(null);
  });
});
