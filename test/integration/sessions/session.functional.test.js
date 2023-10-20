import supertest from "supertest";
import { expect } from "chai";
import { CartService, UserService } from "../../../src/repositories/index.js";
import {
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  BASE_API_URL,
  SESSION_ROUTES,
} from "../../../src/config/config.js";

describe("Functional test - Should test Session endpoints", () => {
  let requester;
  let authToken;

  beforeEach(() => {
    requester = supertest(String(BASE_API_URL));
  });

  it("Should test POST /api/v1/sessions/ - register a new user in database with code 201/302", async () => {
    // Body de la petición
    const userBody = {
      first_name: "Juan",
      last_name: "Perez",
      email: "jperez@gmail.com",
      age: 25,
      password: "123456aA$",
    };

    // Crear un usuario
    const { statusCode } = await requester
      .post(`${SESSION_ROUTES}/register`)
      .send(userBody);

    expect(statusCode).to.equal(302);

    // Eliminar el usuario de la base de datos:
    const user = await UserService.findUser(userBody.email);

    const uid = String(user.id);

    await UserService.deleteUser(uid);
  });

  it("Should test POST /api/v1/sessions - return Error 400 - User already exists.", async () => {
    // Body de la petición
    const userBody = {
      first_name: "Juan",
      last_name: "Perez",
      email: "jperez@gmail.com",
      age: 25,
      password: "123456aA$",
    };

    // Crear un usuario
    const { statusCode } = await requester
      .post(`${SESSION_ROUTES}/register`)
      .send(userBody);

    expect(statusCode).to.equal(302);

    const user = await UserService.findUser(userBody.email);

    // Crear el mismo usuario:
    const { statusCode: recreateUserStatus, _body: recreateUserBody } =
      await requester.post(`${SESSION_ROUTES}/register`).send(userBody);

    expect(recreateUserStatus).to.equal(400);
    expect(recreateUserBody).to.have.property("message");
    expect(recreateUserBody.message).to.equal("Error - User already exists.");

    // Eliminar el usuario de la base de datos:
    const uid = String(user.id);

    await UserService.deleteUser(uid);
  });

  it("Should test POST /api/v1/sessions/login - successfully log in with code 200.", async () => {
    const userBody = {
      first_name: "Juan",
      last_name: "Perez",
      email: "jperez@gmail.com",
      age: 25,
      password: "123456aA$",
    };

    // Crear un usuario
    const {
      statusCode: registerCode,
      ok: registerOk,
      _body: registerBody,
    } = await requester.post(`${SESSION_ROUTES}/register`).send(userBody);

    expect(registerCode).to.equal(302);

    // Iniciar sesión:
    const { statusCode } = await requester
      .post(`${SESSION_ROUTES}/login`)
      .send({ email: userBody.email, password: userBody.password });

    expect(statusCode).to.equal(200);

    // Eliminar el usuario y su carrito de la base de datos:
    const user = await UserService.findUser(userBody.email);

    const uid = String(user.id);
    const cid = String(user.carts[0]._id);

    await UserService.deleteUser(uid);
    await CartService.deleteCartById(cid);
  });

  it("Should test POST /api/v1/sessions/login - admin successfully log in with code 200.", async () => {
    const adminData = {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    };

    // Iniciar sesión:
    const { statusCode } = await requester
      .post(`${SESSION_ROUTES}/login`)
      .send(adminData);

    expect(statusCode).to.equal(200);
  });

  it("Should test POST /api/v1/sessions/login - return Error 404 - User not found.", async () => {
    const userData = {
      email: "usuarioinexistente@gmail.com",
      password: "123456aA$",
    };

    // Iniciar sesión:
    const { statusCode } = await requester
      .post(`${SESSION_ROUTES}/login`)
      .send(userData);

    expect(statusCode).to.equal(302);
  });

  it("Should test POST /api/v1/sessions/recover - Successfully send recovery email to user with code 200.", async () => {
    const userBody = {
      first_name: "Juan",
      last_name: "Perez",
      email: "jperez@gmail.com",
      age: 25,
      password: "123456aA$",
    };

    // Crear un usuario
    const { statusCode: registerCode } = await requester
      .post(`${SESSION_ROUTES}/register`)
      .send(userBody);

    expect(registerCode).to.equal(302);

    // Recuperar contraseña:
    const { statusCode } = await requester
      .post(`${SESSION_ROUTES}/recover`)
      .send(userBody);
    expect(statusCode).to.equal(200);

    // Eliminar el usuario de la base de datos:
    const user = await UserService.findUser(userBody.email);

    const uid = String(user.id);

    await UserService.deleteUser(uid);
  });

  it("Should test POST /api/v1/sessions/recover - return Error 404 - User not found", async () => {
    const userData = {
      email: "usuarioinexistente@gmail.com",
    };

    const { statusCode } = await requester
      .post(`${SESSION_ROUTES}/recover`)
      .send(userData);

    expect(statusCode).to.equal(302);
  });

  it("Should test POST /api/v1/sessions/reset - Successfully generate a new password with code 200.", async () => {
    const userBody = {
      first_name: "Juan",
      last_name: "Perez",
      email: "jperez@gmail.com",
      age: 25,
      password: "123456aA$",
    };

    // Crear un usuario
    const { statusCode: registerCode } = await requester
      .post(`${SESSION_ROUTES}/register`)
      .send(userBody);

    expect(registerCode).to.equal(302);

    // Regenerar contraseña:
    const newPasswordBody = {
      email: userBody.email,
      password: "1234567aA$",
    };

    const { statusCode } = await requester
      .post(`${SESSION_ROUTES}/reset`)
      .send(newPasswordBody);

    expect(statusCode).to.equal(302);

    // Eliminar el usuario de la base de datos:
    const user = await UserService.findUser(userBody.email);

    const uid = String(user.id);

    await UserService.deleteUser(uid);
  });

  it("Should test POST /api/v1/sessions/reset - return Error 400 - Password cannot be the same as the existing one.", async () => {
    const userBody = {
      first_name: "Juan",
      last_name: "Perez",
      email: "jperez@gmail.com",
      age: 25,
      password: "123456aA$",
    };

    // Crear un usuario
    const { statusCode: registerCode } = await requester
      .post(`${SESSION_ROUTES}/register`)
      .send(userBody);

    expect(registerCode).to.equal(302);

    // Regenerar contraseña:
    const newPasswordBody = {
      email: userBody.email,
      password: userBody.password,
    };

    const { statusCode, _body } = await requester
      .post(`${SESSION_ROUTES}/reset`)
      .send(newPasswordBody);

    expect(statusCode).to.equal(400);
    expect(_body).to.have.property("message");
    expect(_body.message).to.equal(
      "Error - Password cannot be the same as the existing one."
    );

    // Eliminar el usuario de la base de datos:
    const user = await UserService.findUser(userBody.email);

    const uid = String(user.id);

    await UserService.deleteUser(uid);
  });

  it("Should test POST /api/v1/sessions/reset - return Error 404 - User not found.", async () => {
    const userBody = {
      email: "usuarioinexistente@gmail.com",
      password: "1234567aA$",
    };

    const { statusCode } = await requester
      .post(`${SESSION_ROUTES}/reset`)
      .send(userBody);

    expect(statusCode).to.equal(302);
  });

  it("Should test POST /api/v1/sessions/reset - return Error 400 - Invalid password", async () => {
    const userBody = {
      email: "usuarioinexistente@gmail.com",
      password: "123456",
    };

    const { statusCode, _body } = await requester
      .post(`${SESSION_ROUTES}/reset`)
      .send(userBody);

    expect(statusCode).to.equal(400);
    expect(_body).to.have.property("message");
    expect(_body.message).to.equal(
      "Error - Password must be at least 8 characters long."
    );
  });

  it("Should test GET /api/v1/sessions/logout - Return Error 401 - No user session found", async () => {
    const { statusCode, _body } = await requester.get(
      `${SESSION_ROUTES}/logout`
    );

    expect(statusCode).to.equal(401);
    expect(_body).to.have.property("error");
    expect(_body.error).to.equal("Error: No auth token");
  });

  it("Should test GET /api/v1/sessions/logout - Successfully log out of user session with code 302.", async () => {
    const userBody = {
      first_name: "Juan",
      last_name: "Perez",
      email: "jperez@gmail.com",
      age: 25,
      password: "123456aA$",
    };

    // Crear un usuario
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

    // Cerrar sesión:
    const { statusCode, _body } = await requester
      .get(`${SESSION_ROUTES}/logout`)
      .set("Cookie", authToken);

    expect(statusCode).to.equal(302);

    // Eliminar el usuario y su carrito de la base de datos:
    const user = await UserService.findUser(userBody.email);

    const uid = String(user.id);
    const cid = String(user.carts[0]._id);

    await UserService.deleteUser(uid);
    await CartService.deleteCartById(cid);
  });

  it("Should test GET /api/v1/sessions/logout - Return Error 401 - No auth token.", async () => {
    const { statusCode, _body } = await requester.get(
      `${SESSION_ROUTES}/logout`
    );

    expect(statusCode).to.equal(401);
    expect(_body).to.have.property("error");
    expect(_body.error).to.equal("Error: No auth token");
  });

  it("Should test GET /api/v1/sessions/current - Get current user session with code 200.", async () => {
    const userBody = {
      first_name: "Juan",
      last_name: "Perez",
      email: "jperez@gmail.com",
      age: 25,
      password: "123456aA$",
    };

    // Crear un usuario
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

    const { statusCode, _body } = await requester
      .get(`${SESSION_ROUTES}/current`)
      .set("Cookie", authToken);

    expect(statusCode).to.equal(200);
    expect(_body).to.have.property("message");

    // Eliminar el usuario y su carrito de la base de datos:
    const user = await UserService.findUser(userBody.email);

    const uid = String(user.id);
    const cid = String(user.carts[0]._id);

    await UserService.deleteUser(uid);
    await CartService.deleteCartById(cid);
  });

  it("Should test GET /api/v1/sessions/current - Return Error 401 - No auth token.", async () => {
    const { statusCode, _body } = await requester.get(
      `${SESSION_ROUTES}/current`
    );

    expect(statusCode).to.equal(401);
    expect(_body).to.have.property("error");
    expect(_body.error).to.equal("Error: No auth token");
  });
});
