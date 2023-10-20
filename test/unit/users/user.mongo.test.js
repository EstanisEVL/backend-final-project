import mongoose from "mongoose";
import { expect } from "chai";
import { MONGO_URL } from "../../../src/config/config.js";
import Users from "../../../src/dao/mongodb/user.mongo.js";

describe("Should test Users mongodb dao", () => {
  let userDao;

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
    userDao = new Users();
  });

  it("Should get all users", async () => {
    const users = await userDao.get();
    expect(users).to.be.an("array");
  });

  it("Should get a user by its id", async () => {
    // Crear un usuario:
    const userInfo = {
      email: "prueba2@gmail.com",
      password: "123456",
    };

    const newUser = await userDao.create(userInfo);

    expect(newUser).to.have.property("_id");

    // Buscar usuario creado por su mongo id:
    const uid = String(newUser._id);
    const user = await userDao.getUserById(uid);

    expect(user).to.be.an("object");
    expect(user).to.have.property("carts");
    expect(user).to.have.property("documents");

    // Eliminar usuario de prueba de la base de datos:
    await userDao.delete(String(user._id));
  });

  it("Should get a user by its email", async () => {
    // Crear un usuario:
    const userInfo = {
      email: "prueba2@gmail.com",
      password: "123456",
    };

    const newUser = await userDao.create(userInfo);

    expect(newUser).to.have.property("email");

    // Buscar usuario creado por su email:
    const user = await userDao.getUserByEmail(newUser.email);

    expect(user).to.be.an("object");
    expect(user).to.have.property("carts");
    expect(user).to.have.property("documents");

    // Eliminar usuario de prueba de la base de datos:
    await userDao.delete(String(user._id));
  });

  it("Should create a new user", async () => {
    // Crear un usuario:
    const userInfo = {
      email: "prueba2@gmail.com",
      password: "123456",
    };

    const newUser = await userDao.create(userInfo);

    expect(newUser).to.be.an("object");
    expect(newUser).to.have.property("_id");
    expect(newUser).to.have.property("carts");
    expect(newUser).to.have.property("documents");

    // Eliminar usuario de prueba de la base de datos:
    await userDao.delete(String(newUser._id));
  });

  it("Should update a user", async () => {
    // Crear un usuario:
    const userInfo = {
      email: "prueba2@gmail.com",
      password: "123456",
    };

    const newUser = await userDao.create(userInfo);

    expect(newUser).to.have.property("_id");
    expect(newUser).to.have.property("password");

    // Actualizar la contraseña del usuario recién creado:
    const updatedInfo = "1234567";

    const user = await userDao.getUserById(newUser._id.toHexString());

    await userDao.update(user.email, updatedInfo);

    const updatedUser = await userDao.getUserById(newUser._id.toHexString());

    expect(updatedUser.password).to.equal(updatedInfo);
    expect(updatedUser.password).to.not.equal(userInfo.password);

    // Eliminar usuario de prueba de la base de datos:
    await userDao.delete(String(newUser._id));
  });
});
