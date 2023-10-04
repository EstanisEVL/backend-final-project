import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { collection as productCollection } from "./product.model.js";

export const collection = "Carts";

const schema = new mongoose.Schema({
  products: {
    type: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: productCollection,
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    default: [],
  },
});

schema.plugin(mongoosePaginate);
const cartModel = mongoose.model(collection, schema);

export default cartModel;
