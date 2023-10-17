import mongoose from "mongoose";
import { expect } from "chai";
import { MONGO_URL } from "../../../src/config/config.js";
import Products from "../../../src/dao/mongodb/product.mongo.js";
import ProductDTO from "../../../src/dtos/product.dto.js";

const mockProduct = {
  title: "Mock product",
  description: "Mock product created for unitary test purposes.",
  code: 999999,
  price: 10000,
  status: "disponible",
  stock: 100,
  category: "Tests",
};

describe("Should test Product dao methods", () => {
  let productDao;

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
    productDao = new Products();
  });

  it("Should GET all products in data base", async () => {
    const products = await productDao.get();

    expect(products).to.be.an("array");
  });

  it("Should GET a product in data base by its ID and check its properties", async () => {
    // Crear producto:
    const productDto = new ProductDTO(mockProduct);
    const newProduct = await productDao.create(productDto);

    expect(newProduct).to.have.property("_id");

    // Buscar producto recién creado por su id:
    const pid = String(newProduct._id);

    const product = await productDao.getById(pid);

    expect(product).to.be.an("object");

    // Borrar producto:
    await productDao.delete(product);
  });

  it("Should GET a product in data base by its code and check its properties", async () => {
    // Crear producto:
    const productDto = new ProductDTO(mockProduct);
    const newProduct = await productDao.create(productDto);

    expect(newProduct).to.have.property("code");

    // Buscar producto recién creado por su código:
    const code = Number(newProduct.code);

    const product = await productDao.getByCode(code);

    expect(product).to.be.an("object");
    expect(product).to.have.property("_id");

    // Borrar producto:
    const pid = String(product._id);

    await productDao.delete(pid);
  });

  it("Should successfully CREATE a product and check its properties", async () => {
    // Crear producto:
    const productDto = new ProductDTO(mockProduct);
    const newProduct = await productDao.create(productDto);

    expect(newProduct).to.be.an("object");
    expect(newProduct).to.have.property("_id");

    // Borrar producto:
    const pid = String(newProduct._id);

    await productDao.delete(pid);
  });

  it("Should successfully UPDATE a product by its id", async () => {
    // Crear producto:
    const productDto = new ProductDTO(mockProduct);
    const newProduct = await productDao.create(productDto);

    expect(newProduct).to.be.an("object");
    expect(newProduct).to.have.property("_id");

    // Actualizar producto:
    const pid = String(newProduct._id);

    const updatedBody = {
      title: "Mock product updated",
    };

    const updatedProduct = await productDao.update(pid, updatedBody);

    expect(updatedProduct).to.be.an("object");
    expect(updatedProduct).to.have.property("title");
    expect(updatedProduct.title).to.not.equal(mockProduct.title);
    expect(updatedProduct.title).to.equal(updatedBody.title);

    // Buscar producto actualizado:
    const checkProduct = await productDao.getById(pid);

    expect(checkProduct).to.be.an("object");
    expect(checkProduct).to.have.property("_id");
    expect(checkProduct).to.have.property("title");
    expect(checkProduct.title).to.equal(updatedProduct.title);

    // Borrar producto actualizado:
    await productDao.delete(String(checkProduct._id));
  });

  it("Should successfully DELETE a product by its id", async () => {
    // Crear producto:
    const productDto = new ProductDTO(mockProduct);
    const newProduct = await productDao.create(productDto);

    expect(newProduct).to.be.an("object");
    expect(newProduct).to.have.property("_id");

    // Borrar producto:
    const pid = String(newProduct._id);

    await productDao.delete(pid);

    // Corroborar que el producto no existe en la base de datos:
    const checkProduct = await productDao.getById(pid);

    expect(checkProduct).to.equal(null);
  });
});
