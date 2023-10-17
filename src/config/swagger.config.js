export const swaggerOptions = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "BLKY PETS - OPEN API",
      description: "BLKY PETS API's endpoint documentation.",
      version: "1.0.1"
    }
  },
  apis: [`./src/docs/**/*.yml`],
};
