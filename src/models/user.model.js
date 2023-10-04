import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { collection as cartCollection } from "./cart.model.js";

export const collection = "Users";

const roleType = {
  admin: "admin",
  premium: "premium",
  user: "user",
};

const schema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: {
    type: String,
    unique: true,
  },
  age: Number,
  password: String,
  carts: {
    type: [
      {
        cart: { type: mongoose.Schema.Types.ObjectId, ref: cartCollection },
      },
    ],
    default: [],
  },
  role: { type: String, enum: Object.values(roleType), default: roleType.user },
  documents: [{ name: String, reference: String, docType: String }],
  last_connection: String,
});

schema.plugin(mongoosePaginate);
const userModel = mongoose.model(collection, schema);

export default userModel;
