import supertest from "supertest";
import { expect } from "chai";
import {
  CartService,
  ProductService,
  UserService,
} from "../../../src/repositories/index.js";
import CartDTO from "../../../src/dtos/cart.dto.js";
import {
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  BASE_API_URL,
  CART_ROUTES,
  SESSION_ROUTES,
} from "../../../src/config/config.js";

describe("Functional test - Should test Cart endpoints.", () => {
  let requester;
  let authToken;

  beforeEach(() => {
    requester = supertest(String(BASE_API_URL));
  });

  it("Should test GET /api/v1/carts - Return all carts in database with code 200.", async () => {
    // Iniciar sesión como administrador:
    const adminBody = {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    };
    const res = await requester
      .post(`${SESSION_ROUTES}/login`)
      .send({ email: adminBody.email, password: adminBody.password });
    const cookie = {
      name: res.headers["set-cookie"][0].split("=")[0],
      value: res.headers["set-cookie"][0].split("=")[1].split(";")[0],
    };
    authToken = res.headers["set-cookie"][0];

    expect(res.statusCode).to.equal(200);

    // Obtener carritos:
    const { statusCode, _body } = await requester
      .get(`${CART_ROUTES}`)
      .set("Cookie", authToken);

    expect(statusCode).to.equal(200);
    expect(_body).to.have.property("message");
    expect(_body.message).to.equal("Carts in data base - ");
    expect(_body).to.have.property("carts");
    expect(_body.carts[0]).to.have.property("products");
    expect(_body.carts[0].products).to.be.an("array");
  });

  it("Should test GET /api/v1/carts/:cid - Return a cart from data base by its id with code 200.", async () => {
    // Crear un carrito:
    const cartDto = new CartDTO();
    const cart = await CartService.createCart(cartDto);

    const cid = String(cart._id);

    // Obtener el carrito creado:
    const { statusCode, _body } = await requester.get(`${CART_ROUTES}/${cid}`);

    expect(statusCode).to.equal(200);
    expect(_body).to.have.property("cart");

    // Eliminar el carrito:
    await CartService.deleteCartById(cid);
  });

  it("Should test POST /api/v1/carts - Successfully create a cart in database with code 200.", async () => {
    // Crear carrito:
    const { statusCode, _body } = await requester.post(`${CART_ROUTES}`);

    expect(statusCode).to.equal(200);
    expect(_body).to.have.property("cart");
    expect(_body.cart).to.have.property("_id");

    // Eliminar carrito:
    const cid = String(_body.cart._id);

    await CartService.deleteCartById(cid);
  });

  it("Should test POST /api/v1/carts/:cid/products/:pid - Successfully add a product to a cart in database with code 200.", async () => {
    // Registrar usuario:
    const userBody = {
      first_name: "Juan",
      last_name: "Perez",
      email: "jperez@gmail.com",
      age: 25,
      password: "123456aA$",
    };

    const { statusCode: registerCode } = await requester
      .post(`${SESSION_ROUTES}/register`)
      .send(userBody);

    expect(registerCode).to.equal(302);

    // Iniciar sesión:
    const res = await requester
      .post(`${SESSION_ROUTES}/login`)
      .send({ email: userBody.email, password: userBody.password });
    const cookie = {
      name: res.headers["set-cookie"][0].split("=")[0],
      value: res.headers["set-cookie"][0].split("=")[1].split(";")[0],
    };
    authToken = res.headers["set-cookie"][0];

    expect(res.statusCode).to.equal(200);

    // Buscar productos:
    const products = await ProductService.getAllProducts();
    const pid = String(products[0]._id);

    // Agregar el producto al carrito:
    const user = await UserService.findUser(userBody.email);
    const cid = String(user.carts[0]._id);

    const { statusCode, _body } = await requester
      .post(`${CART_ROUTES}/${cid}/products/${pid}`)
      .set("Cookie", authToken);

    expect(statusCode).to.equal(200);
    expect(_body).to.have.property("message");
    expect(_body.message).to.equal("Product added to cart.");

    // Eliminar el usuario y su carrito de la base de datos:
    const uid = String(user.id);

    await UserService.deleteUser(uid);
    await CartService.deleteCartById(cid);
  });

  it("Should test PUT /api/v1/carts/:cid/products/:pid - Successfully update a product in a cart with code 200.", async () => {
    // Registrar usuario:
    const userBody = {
      first_name: "Juan",
      last_name: "Perez",
      email: "jperez@gmail.com",
      age: 25,
      password: "123456aA$",
    };

    const { statusCode: registerCode, _body: registerBody } = await requester
      .post(`${SESSION_ROUTES}/register`)
      .send(userBody);

    expect(registerCode).to.equal(302);

    // Iniciar sesión:
    const res = await requester
      .post(`${SESSION_ROUTES}/login`)
      .send({ email: userBody.email, password: userBody.password });
    const cookie = {
      name: res.headers["set-cookie"][0].split("=")[0],
      value: res.headers["set-cookie"][0].split("=")[1].split(";")[0],
    };
    authToken = res.headers["set-cookie"][0];

    expect(res.statusCode).to.equal(200);

    // Buscar productos:
    const products = await ProductService.getAllProducts();
    const pid = String(products[0]._id);

    // Agregar el producto al carrito:
    const user = await UserService.findUser(userBody.email);
    const cid = String(user.carts[0]._id);

    const { statusCode: addCode, _body: addBody } = await requester
      .post(`${CART_ROUTES}/${cid}/products/${pid}`)
      .set("Cookie", authToken);

    expect(addCode).to.equal(200);
    expect(addBody).to.have.property("message");
    expect(addBody.message).to.equal("Product added to cart.");

    // Agregar 5 unidades de un producto al carrito:
    const addProductBody = {
      operation: "add",
      quantity: 5,
    };

    const { statusCode: updateAddCode, _body: updateAddBody } = await requester
      .put(`${CART_ROUTES}/${cid}/products/${pid}`)
      .send(addProductBody);

    expect(updateAddCode).to.equal(200);
    expect(updateAddBody).to.have.property("message");
    expect(updateAddBody.message).to.equal(
      "Product quantity succesfully updated."
    );

    // Quitar 5 unidades de un producto al carrito:
    const removeProductBody = {
      operation: "remove",
      quantity: 5,
    };

    const { statusCode: updateRemoveCode, _body: updateRemoveBody } =
      await requester
        .put(`${CART_ROUTES}/${cid}/products/${pid}`)
        .send(removeProductBody);

    expect(updateRemoveCode).to.equal(200);
    expect(updateRemoveBody).to.have.property("message");
    expect(updateRemoveBody.message).to.equal(
      "Product quantity succesfully updated."
    );

    // Eliminar el usuario y su carrito de la base de datos:
    const uid = String(user.id);

    await UserService.deleteUser(uid);
    await CartService.deleteCartById(cid);
  });

  it("Should test DELETE /api/v1/carts/:cid - Delete a cart in database with code 200.", async () => {
    // Iniciar sesión como administrador:
    const adminBody = {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    };
    const res = await requester
      .post(`${SESSION_ROUTES}/login`)
      .send({ email: adminBody.email, password: adminBody.password });
    const cookie = {
      name: res.headers["set-cookie"][0].split("=")[0],
      value: res.headers["set-cookie"][0].split("=")[1].split(";")[0],
    };
    authToken = res.headers["set-cookie"][0];

    expect(res.statusCode).to.equal(200);

    // Crear carrito:
    const cartDto = new CartDTO();
    const newCart = await CartService.createCart(cartDto);

    const cid = String(newCart._id);

    // Eliminar carrito por su id:
    const { statusCode, _body } = await requester
      .delete(`${CART_ROUTES}/${cid}`)
      .set("Cookie", authToken);

    expect(statusCode).to.equal(200);
    expect(_body).to.have.property("message");
    expect(_body.message).to.equal("Cart successfully deleted.");
  });

  it("Should test DELETE /api/v1/carts/:cid/products/:pid - Successfully deletes a product from a cart with code 200.", async () => {
    // Registrar usuario:
    const userBody = {
      first_name: "Juan",
      last_name: "Perez",
      email: "jperez@gmail.com",
      age: 25,
      password: "123456aA$",
    };

    const { statusCode: registerCode, _body: registerBody } = await requester
      .post(`${SESSION_ROUTES}/register`)
      .send(userBody);

    expect(registerCode).to.equal(302);

    // Iniciar sesión:
    const res = await requester
      .post(`${SESSION_ROUTES}/login`)
      .send({ email: userBody.email, password: userBody.password });
    const cookie = {
      name: res.headers["set-cookie"][0].split("=")[0],
      value: res.headers["set-cookie"][0].split("=")[1].split(";")[0],
    };
    authToken = res.headers["set-cookie"][0];

    expect(res.statusCode).to.equal(200);

    // Buscar productos:
    const products = await ProductService.getAllProducts();
    const pid = String(products[0]._id);

    // Agregar el producto al carrito:
    const user = await UserService.findUser(userBody.email);
    const cid = String(user.carts[0]._id);

    const { statusCode: addCode, _body: addBody } = await requester
      .post(`${CART_ROUTES}/${cid}/products/${pid}`)
      .set("Cookie", authToken);

    expect(addCode).to.equal(200);
    expect(addBody).to.have.property("message");
    expect(addBody.message).to.equal("Product added to cart.");

    // Eliminar producto del carrito:
    const { statusCode, _body } = await requester.delete(
      `${CART_ROUTES}/${cid}/products/${pid}`
    );

    expect(statusCode).to.equal(200);
    expect(_body).to.have.property("message");
    expect(_body.message).to.equal("Product deleted from cart.");

    // Eliminar el usuario y su carrito de la base de datos:
    const uid = String(user.id);

    await UserService.deleteUser(uid);
    await CartService.deleteCartById(cid);
  });

  it("Should test POST /api/v1/carts/:cid/purchase - Successfully complete a purchse process with code 200.", async () => {
    // Registrar usuario:
    const userBody = {
      first_name: "Juan",
      last_name: "Perez",
      email: "estanis_89@hotmail.com",
      age: 25,
      password: "123456aA$",
    };

    const { statusCode: registerCode, _body: registerBody } = await requester
      .post(`${SESSION_ROUTES}/register`)
      .send(userBody);

    expect(registerCode).to.equal(302);

    // Iniciar sesión:
    const res = await requester
      .post(`${SESSION_ROUTES}/login`)
      .send({ email: userBody.email, password: userBody.password });
    const cookie = {
      name: res.headers["set-cookie"][0].split("=")[0],
      value: res.headers["set-cookie"][0].split("=")[1].split(";")[0],
    };
    authToken = res.headers["set-cookie"][0];

    expect(res.statusCode).to.equal(200);

    // Buscar productos:
    const products = await ProductService.getAllProducts();
    const pid = String(products[0]._id);

    // Agregar el producto al carrito:
    const user = await UserService.findUser(userBody.email);
    const cid = String(user.carts[0]._id);

    const { statusCode: addCode, _body: addBody } = await requester
      .post(`${CART_ROUTES}/${cid}/products/${pid}`)
      .set("Cookie", authToken);

    expect(addCode).to.equal(200);
    expect(addBody).to.have.property("message");
    expect(addBody.message).to.equal("Product added to cart.");

    // Confirma la compra:
    const { statusCode, _body } = await requester
      .post(`${CART_ROUTES}/${cid}/purchase`)
      .send(userBody);

    expect(statusCode).to.equal(200);
    expect(_body).to.have.property("message");
    expect(_body.message).to.equal("Purchase successfully completed.");

    // Eliminar el usuario y su carrito de la base de datos:
    const uid = String(user.id);

    await UserService.deleteUser(uid);
    await CartService.deleteCartById(cid);
  });
});
