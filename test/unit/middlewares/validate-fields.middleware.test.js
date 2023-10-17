import { expect } from "chai";
import validateBodyFields from "../../../src/middlewares/validate-fields.middleware.js";

const mockData = [
  {
    value: {
      first_name: "Usuario",
      last_name: "DePrueba",
      email: "prueba2@gmail.com",
      age: 50,
      password: "123456aA$",
    },
  },
  {
    value: {
      first_name: "Juan0",
      last_name: "Pe",
      email: "jperez",
      age: -1,
      password: "654321",
    },
  },
];

describe("Should test validate-fields middleware", () => {
  it.only("Should unsuccesffully validate all req.body fields", (done) => {
    const req = {
      body: mockData[1].value,
    };

    const res = { send: () => {}, json: () => {} };

    const next = () => {
      // expect(req.body.first_name).to.not.match(/^[A-Za-z]{4,20}$/);
      done();
    };
    
    validateBodyFields(req, res, next);
  });

  it("Should succesffully validate all req.body fields", async () => {
    const req = {
      body: mockData[0].value,
    };

    validateBodyFields(req, null);
  });
});

// expect(req.body).to.have.property("first_name");
// expect(req.body).to.have.property("last_name");
// expect(req.body).to.have.property("email");
// expect(req.body).to.have.property("age");
// expect(req.body).to.have.property("password");

// const lettersOnlyAndMinMaxCharsRegex = /^[A-Za-z]{4,20}$/;

// expect(req.body.first_name).to.match(lettersOnlyAndMinMaxCharsRegex);
// expect(req.body.last_name).to.match(lettersOnlyAndMinMaxCharsRegex);

// const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// expect(req.body.email).to.match(emailRegex);

// expect(req.body.age)
//   .to.be.a("number")
//   .and.to.be.above(0)
//   .and.to.be.below(121);

// const passwordRegex =
//   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;

// expect(req.body.password).to.match(passwordRegex);
