import supertest from "supertest";
import { expect } from "chai";

const BASE_API_URL = "http://localhost:8080/";
const USER_ROUTES = "api/v1/users/";

describe("Functional test - Should test User endpoints", () => {
  let requester;

  beforeEach(() => {
    requester = supertest(String(BASE_API_URL));
  });

  it("Should test GET /api/v1/users/ - get all users in database", async () => {
    const { statusCode, ok, _body } = await requester.get(`${USER_ROUTES}`);

    expect(statusCode).to.equal(200);
    expect(_body).to.have.property("users");
    expect(_body.users).to.be.an("array");

    _body.users.forEach((user) => {
      expect(user).to.not.have.property("password");
    });
  });

  // Continuar pruebas de endpoints de users:
  

});
