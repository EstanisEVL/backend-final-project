import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

export const collection = "Tickets";

const schema = new mongoose.Schema({
  code: { type: String, unique: true },
  purchase_datetime: { type: Date },
  amount: { type: Number },
  purchaser: { type: String },
});

schema.pre("save", async function (next) {
  if(!this.code) {
    let code = `${Math.random().toString(20).substring(2,10).toUpperCase()}`;
    this.code = code;
  }
  next();
});

schema.plugin(mongoosePaginate);
const ticketModel = mongoose.model(collection, schema);

export default ticketModel;