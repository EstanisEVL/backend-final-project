import supertest from "supertest";
import { expect } from "chai";
import { UserService } from "../../../src/repositories/index.js";
import {
  BASE_API_URL,
  SESSION_ROUTES,
  USER_ROUTES,
} from "../../../src/config/config.js";

describe("Functional test - Should test User endpoints.", () => {
  let requester;

  beforeEach(() => {
    requester = supertest(String(BASE_API_URL));
  });

  it("Should test GET /api/v1/users - Return all users in database with code 200.", async () => {
    // Obtener todos los usuarios existentes en la base de datos:
    const { statusCode, ok, _body } = await requester.get(`${USER_ROUTES}`);

    expect(statusCode).to.equal(200);
    expect(_body).to.have.property("users");
    expect(_body.users).to.be.an("array");

    _body.users.forEach((user) => {
      expect(user).to.not.have.property("password");
    });
  });

  it("Should test DELETE /api/v1/users - Successfully delete all inactive users with code 200.", async () => {
    // Body de la petición
    const userBody = {
      first_name: "Juan",
      last_name: "Perez",
      email: "estanis_89@hotmail.com",
      age: 25,
      password: "123456aA$",
    };

    // Crear un usuario
    const { statusCode: registerCode, _body: registerBody } = await requester
      .post(`${SESSION_ROUTES}/register`)
      .send(userBody);

    expect(registerCode).to.equal(200);
    expect(registerBody).to.have.property("user");
    expect(registerBody.user).to.have.property("id");

    // Iniciar sesión:
    const { statusCode: loginCode, _body: loginBody } = await requester
      .post(`${SESSION_ROUTES}/login`)
      .send({ email: userBody.email, password: userBody.password });

    expect(loginCode).to.equal(200);
    expect(loginBody).to.have.property("user");
    expect(loginBody.user).to.have.property("email");
    expect(loginBody.user).to.have.property("last_connection");

    const user = await UserService.findUser(loginBody.user.email);

    const currentDate = new Date();
    const date = new Date(currentDate);
    date.setDate(currentDate.getDate() - 3);

    user.last_connection = date;

    await user.save();

    // Limpiar usuarios inactivos:
    const { statusCode, ok, _body } = await requester.delete(`${USER_ROUTES}`);

    expect(statusCode).to.equal(200);
    expect(_body).to.have.property("message");
    expect(_body.message).to.equal(
      "Inactive users successfully notified and deleted."
    );
  });

  it("Should test POST /api/v1/users/:uid/documents - Successfully upload a document with code 200.", async () => {
    // Crear un usuario:
    const userBody = {
      first_name: "Juan",
      last_name: "Perez",
      email: "jperez@gmail.com",
      age: 25,
      password: "123456aA$",
    };

    const newUser = await UserService.createUser(userBody);

    // Obtener uid:
    const uid = String(newUser._id);

    // Subir documento:
    const doc = {
      type: "document",
      document_type: "identificacion",
    };

    const { statusCode, ok, _body } = await requester
      .post(`${USER_ROUTES}/${uid}/documents`)
      .field("type", doc.type)
      .field("document_type", doc.document_type)
      .attach("documents", "./test/integration/test.png");

    expect(statusCode).to.equal(200);
    expect(_body).to.have.property("message");
    expect(_body.message).to.equal("Documents successfully uploaded.");

    // Eliminar el usuario:
    await UserService.deleteUser(uid);
  });

  it("Should test GET /api/v1/users/premium/:uid - Successfully changes a user's role to premium with code 200.", async () => {
    // Crear un usuario:
    const userBody = {
      first_name: "Juan",
      last_name: "Perez",
      email: "jperez@gmail.com",
      age: 25,
      password: "123456aA$",
    };

    const newUser = await UserService.createUser(userBody);

    // Obtener uid:
    const uid = String(newUser._id);

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
    const { statusCode, ok, _body } = await requester.get(
      `${USER_ROUTES}/premium/${uid}`
    );

    expect(statusCode).to.equal(200);
    expect(_body).to.have.property("message");
    expect(_body.message).to.equal("Role changed to premium");

    // Eliminar el usuario:
    await UserService.deleteUser(uid);
  });
});
