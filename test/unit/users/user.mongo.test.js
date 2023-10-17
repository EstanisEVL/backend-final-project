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
    const uid = "651c93389a348738a43a73b6";
    const user = await userDao.getUserById(uid);

    expect(user).to.be.an("object");
    expect(user).to.have.property("carts");
    expect(user).to.have.property("documents");
  });

  it("Should get a user by its email", async () => {
    const email = "jooherrera5@gmail.com";
    const user = await userDao.getUserByEmail(email);

    expect(user).to.be.an("object");
    expect(user).to.have.property("carts");
    expect(user).to.have.property("documents");
  });

  it("Should create a new user", async () => {
    const userInfo = {
      email: "prueba2@gmail.com",
      password: "123456",
    };

    const newUser = await userDao.create(userInfo);

    expect(newUser).to.be.an("object");
    expect(newUser).to.have.property("_id");
    expect(newUser).to.have.property("carts");
    expect(newUser).to.have.property("documents");

    await userDao.delete(newUser._id);
  });

  it("Should update a user", async () => {
    const userInfo = {
      email: "prueba2@gmail.com",
      password: "123456",
    };

    const newUser = await userDao.create(userInfo);

    expect(newUser).to.have.property("_id");
    expect(newUser).to.have.property("password");

    const updatedInfo = "1234567";

    const user = await userDao.getUserById(newUser._id.toHexString());

    await userDao.update(user.email, updatedInfo);

    const updatedUser = await userDao.getUserById(newUser._id.toHexString());

    expect(updatedUser.password).to.equal(updatedInfo);
    expect(updatedUser.password).to.not.equal(userInfo.password);

    await userDao.delete(newUser._id);
  });
});
