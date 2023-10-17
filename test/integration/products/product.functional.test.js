import supertest from "supertest";
import { expect } from "chai";
import {
  CartService,
  ProductService,
  UserService,
} from "../../../src/repositories/index.js";
import ProductDTO from "../../../src/dtos/product.dto.js";
import {
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  BASE_API_URL,
  PRODUCT_ROUTES,
  SESSION_ROUTES,
  USER_ROUTES,
} from "../../../src/config/config.js";

const mockProduct = {
  title: "Mock product",
  description: "Mock product created for unitary test purposes.",
  code: 999999,
  price: 10000,
  status: "disponible",
  stock: 100,
  category: "Tests",
};

describe("Functional test - Should test Product endpoints.", () => {
  let requester;
  let authToken;

  beforeEach(() => {
    requester = supertest(String(BASE_API_URL));
  });

  it("Should test GET /api/v1/products - Return all products in database with code 200.", async () => {
    const { statusCode, _body } = await requester.get(`${PRODUCT_ROUTES}`);

    expect(statusCode).to.equal(200);
    expect(_body).to.have.property("message");
    expect(_body.message).to.equal("Products - ");
    expect(_body).to.have.property("products");
    expect(_body.products).to.be.an("array");
  });

  it("Should test GET /api/v1/products/:pid - Return a product from data base by its id with code 200.", async () => {
    // Crear un producto de prueba:
    const productDto = new ProductDTO(mockProduct);
    const product = await ProductService.createProduct(productDto);

    const pid = String(product._id);

    // Obtener el producto creado:
    const { statusCode, _body } = await requester.get(
      `${PRODUCT_ROUTES}/${pid}`
    );

    expect(statusCode).to.equal(200);
    expect(_body).to.have.property("message");
    expect(_body.message).to.equal("Product found - ");
    expect(_body).to.have.property("product");
    expect(_body.product).to.be.an("object");
    expect(_body.product).to.have.property("_id");

    // Eliminar el producto:
    await ProductService.deleteProduct(_body.product._id);
  });

  it("Should test POST /api/v1/products - Successfully create a product in data base with code 200.", async () => {
    // Iniciar sesión como admin:
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
    expect(res._body).to.have.property("admin");

    // Crear un producto de prueba:
    const productDto = new ProductDTO(mockProduct);
    const { statusCode, _body } = await requester
      .post(`${PRODUCT_ROUTES}`)
      .send(productDto)
      .set("Cookie", authToken);

    expect(statusCode).to.equal(201);
    expect(_body).to.have.property("productBody");
    expect(_body.productBody).to.have.property("_id");

    // Eliminar producto creado:
    const pid = String(_body.productBody._id);

    await ProductService.deleteProduct(pid);
  });

  it("Should test PUT /api/v1/products/:pid - Successfully update a product in data base with code 200.", async () => {
    // Iniciar sesión como admin:
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
    expect(res._body).to.have.property("admin");

    // Crear un producto de prueba:
    const productDto = new ProductDTO(mockProduct);
    const { statusCode: createCode, _body: createBody } = await requester
      .post(`${PRODUCT_ROUTES}`)
      .send(productDto)
      .set("Cookie", authToken);

    expect(createCode).to.equal(201);
    expect(createBody).to.have.property("productBody");
    expect(createBody.productBody).to.have.property("_id");

    // Modificar el producto creado:
    const pid = String(createBody.productBody._id);

    const updatedBody = {
      title: "Mock product actualizado desde test funcional."
    }

    const { statusCode, _body } = await requester.put(`${PRODUCT_ROUTES}/${pid}`).send(updatedBody).set("Cookie", authToken);

    expect(statusCode).to.equal(200);
    expect(_body).to.have.property("message");
    expect(_body).to.have.property("updatedProduct");
    expect(_body.updatedProduct.title).to.not.equal(createBody.productBody.title);

    // Eliminar producto creado:
    const { statusCode: deleteCode, _body: deleteBody } = await requester
      .delete(`${PRODUCT_ROUTES}/${pid}`)
      .set("Cookie", authToken);

    expect(deleteCode).to.equal(200);
    expect(deleteBody).to.have.property("message");
    expect(deleteBody.message).to.equal("Product deleted - ");
  });

  it("Should test DELETE /api/v1/products/:pid - Successfully delete a product in data base as admin with code 200.", async () => {
    // Iniciar sesión como admin:
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
    expect(res._body).to.have.property("admin");

    // Crear un producto de prueba:
    const productDto = new ProductDTO(mockProduct);
    const { statusCode: createCode, _body: createBody } = await requester
      .post(`${PRODUCT_ROUTES}`)
      .send(productDto)
      .set("Cookie", authToken);

    expect(createCode).to.equal(201);
    expect(createBody).to.have.property("productBody");
    expect(createBody.productBody).to.have.property("_id");

    // Eliminar producto creado:
    const pid = String(createBody.productBody._id);

    const { statusCode, _body } = await requester
      .delete(`${PRODUCT_ROUTES}/${pid}`)
      .set("Cookie", authToken);

    expect(statusCode).to.equal(200);
    expect(_body).to.have.property("message");
    expect(_body.message).to.equal("Product deleted - ");
  });

  it("Should test DELETE /api/v1/products/:pid - Successfully delete a product in data base as premium user with code 200.", async () => {
    // Crear un usuario:
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

    expect(registerCode).to.equal(200);
    expect(registerBody).to.have.property("user");
    expect(registerBody.user).to.have.property("id");

    // Obtener uid:
    const uid = String(registerBody.user.id);

    // Subir documentos:
    const docs = [
      {
        type: "document",
        document_type: "identificacion",
        documents: "./test/integration/test.png",
      },
      {
        type: "profileImg",
        document_type: "comprobantededomicilio",
        documents: "./test/integration/test.png",
      },
      {
        type: "productImg",
        document_type: "comprobantedeestadodecuenta",
        documents: "./test/integration/test.png",
      },
    ];

    for (const doc of docs) {
      const { statusCode: uploadStatus, _body: uploadBody } = await requester
        .post(`${USER_ROUTES}/${uid}/documents`)
        .field("type", doc.type)
        .field("document_type", doc.document_type)
        .attach("documents", "./test/integration/test.png");

      expect(uploadStatus).to.equal(200);
      expect(uploadBody).to.have.property("message");
      expect(uploadBody.message).to.equal("Documents successfully uploaded.");
    }

    // Cambiar el rol a premium:
    const {
      statusCode: premiumCode,
      ok,
      _body: premiumBody,
    } = await requester.get(`${USER_ROUTES}/premium/${uid}`);

    expect(premiumCode).to.equal(200);
    expect(premiumBody).to.have.property("message");
    expect(premiumBody.message).to.equal("Role changed to premium");

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
    expect(res._body).to.have.property("user");

    // Crear un producto de prueba:
    const productDto = new ProductDTO(mockProduct);
    const { statusCode: createCode, _body: createBody } = await requester
      .post(`${PRODUCT_ROUTES}`)
      .send(productDto)
      .set("Cookie", authToken);

    expect(createCode).to.equal(201);
    expect(createBody).to.have.property("productBody");
    expect(createBody.productBody).to.have.property("_id");

    // Eliminar producto creado:
    const pid = String(createBody.productBody._id);

    const { statusCode, _body } = await requester
      .delete(`${PRODUCT_ROUTES}/${pid}`)
      .set("Cookie", authToken);

    expect(statusCode).to.equal(200);
    expect(_body).to.have.property("message");
    expect(_body.message).to.equal("Product deleted - ");

    // Eliminar el usuario y su carrito de la base de datos:
    const cid = String(res._body.user.userCarts._id);

    await UserService.deleteUser(uid);
    await CartService.deleteCartById(cid);
  });

  it("Should test DELETE /api/v1/products/:pid - Successfully delete a premium user's product in data base as admin with code 200.", async () => {
    // Crear un usuario:
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

    expect(registerCode).to.equal(200);
    expect(registerBody).to.have.property("user");
    expect(registerBody.user).to.have.property("id");

    // Obtener uid:
    const uid = String(registerBody.user.id);

    // Subir documentos:
    const docs = [
      {
        type: "document",
        document_type: "identificacion",
        documents: "./test/integration/test.png",
      },
      {
        type: "profileImg",
        document_type: "comprobantededomicilio",
        documents: "./test/integration/test.png",
      },
      {
        type: "productImg",
        document_type: "comprobantedeestadodecuenta",
        documents: "./test/integration/test.png",
      },
    ];

    for (const doc of docs) {
      const { statusCode: uploadStatus, _body: uploadBody } = await requester
        .post(`${USER_ROUTES}/${uid}/documents`)
        .field("type", doc.type)
        .field("document_type", doc.document_type)
        .attach("documents", "./test/integration/test.png");

      expect(uploadStatus).to.equal(200);
      expect(uploadBody).to.have.property("message");
      expect(uploadBody.message).to.equal("Documents successfully uploaded.");
    }

    // Cambiar el rol a premium:
    const {
      statusCode: premiumCode,
      ok,
      _body: premiumBody,
    } = await requester.get(`${USER_ROUTES}/premium/${uid}`);

    expect(premiumCode).to.equal(200);
    expect(premiumBody).to.have.property("message");
    expect(premiumBody.message).to.equal("Role changed to premium");

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
    expect(res._body).to.have.property("user");

    // Crear un producto de prueba:
    const productDto = new ProductDTO(mockProduct);
    const { statusCode: createCode, _body: createBody } = await requester
      .post(`${PRODUCT_ROUTES}`)
      .send(productDto)
      .set("Cookie", authToken);

    expect(createCode).to.equal(201);
    expect(createBody).to.have.property("productBody");
    expect(createBody.productBody).to.have.property("_id");

    // Cerrar sesión:
    const { statusCode: logoutCode, _body: logoutBody } = await requester
      .get(`${SESSION_ROUTES}/logout`)
      .set("Cookie", authToken);

    expect(logoutCode).to.equal(200);
    expect(logoutBody).to.have.property("message");
    expect(logoutBody.message).to.equal("User successfully logged out.");

    // Iniciar sesión como admin:
    const adminBody = {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    };

    const adminRes = await requester
      .post(`${SESSION_ROUTES}/login`)
      .send({ email: adminBody.email, password: adminBody.password });
    const adminCookie = {
      name: adminRes.headers["set-cookie"][0].split("=")[0],
      value: adminRes.headers["set-cookie"][0].split("=")[1].split(";")[0],
    };
    authToken = adminRes.headers["set-cookie"][0];

    expect(adminRes.statusCode).to.equal(200);
    expect(adminRes._body).to.have.property("admin");

    // Eliminar producto creado por el usuario premium:
    const pid = String(createBody.productBody._id);

    const { statusCode, _body } = await requester
      .delete(`${PRODUCT_ROUTES}/${pid}`)
      .set("Cookie", authToken);

    expect(statusCode).to.equal(200);
    console.log(_body);
    expect(_body).to.have.property("message");
    expect(_body.message).to.equal("Product deleted - ");

    // Eliminar el usuario y su carrito de la base de datos:
    const cid = String(res._body.user.userCarts._id);

    await UserService.deleteUser(uid);
    await CartService.deleteCartById(cid);
  });
});
