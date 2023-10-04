import mongoose from "mongoose";
import { MONGO_URL } from "../config/config.js";

export default class Connection {
  static #instance;

  constructor() {
    mongoose.connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }

  static getInstance() {
    if (this.#instance) {
      console.log("Already connected.");
      return this.#instance;
    }
    this.#instance = new Connection();
    console.log("Connected.");
    return this.#instance;
  }
}
