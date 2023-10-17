import { expect } from "chai";
import sinon from "sinon";
import { registerUser } from "../../../src/controllers/session.controller.js";
import { UserService } from "../../../src/repositories/index.js";
import UserDTO from "../../../src/dtos/user.dto.js";

const mockData = [
  {
    id: "651c15a1b7c3f377c52da645",
    first_name: "Usuario",
    last_name: "DePrueba",
    email: "prueba2@gmail.com",
    age: 50,
    password: "123456aA$",
    role: "admin",
  },
  {
    id: "651c15a1b7c3f377c52ad645",
    first_name: "Juan",
    last_name: "Pérez",
    email: "jperez@gmail.com",
    age: 25,
    password: "654321",
    role: "user",
  },
];

describe("Should test session controller methods and validations", () => {
  afterEach(() => {
    sinon.restore();
  });

  it("Should register a new user", async () => {
    const req = {
      body: mockData[0],
      logger: {
        error: sinon.stub(),
      },
    };

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    sinon.stub(UserService, "findUser").resolves(null);

    sinon
      .stub(UserService, "createUser")
      .resolves({ ...mockData[0], _id: "user_id" });

    await registerUser(req, res);

    sinon.assert.calledWith(res.status, 200);

    const expectedUser = new UserDTO({ ...mockData[0], _id: "user_id" });

    sinon.assert.calledWith(
      res.json,
      sinon.match({
        message: "New user successfully registered.",
        user: sinon.match(expectedUser),
      })
    );
  });
});
