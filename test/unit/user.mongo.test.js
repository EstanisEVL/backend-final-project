import mongoose from "mongoose";
import { expect } from "chai";
import { MONGO_URL } from "../../src/config/config.js";
import Users from "../../src/dao/mongodb/user.mongo.js";

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
  })

  it("Should get all users", async () => {
    const users = await userDao.get();
    expect(users).to.be.an("array");
  });

  // Continuar pruebas de dao de mongodb de users:

});
