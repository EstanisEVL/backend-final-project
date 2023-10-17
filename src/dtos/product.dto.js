export default class ProductDTO {
  constructor(product, cid = null) {
    const { id, title, description, code, price, status, stock, category, owner } =
      product;

    this.cid = cid;

    this.id = id;
    this.title = title;
    this.description = description;
    this.code = code;
    this.price = price;
    this.status = status;
    this.stock = stock;
    this.category = category;
    this.owner = owner;
  }
}
