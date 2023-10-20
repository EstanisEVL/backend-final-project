import mongoose from "mongoose";
import { expect } from "chai";
import { MONGO_URL } from "../../../src/config/config.js";
import Tickets from "../../../src/dao/mongodb/ticket.mongo.js";
import TicketDTO from "../../../src/dtos/ticket.dto.js";

describe("Should test Ticket dao methods.", () => {
  let ticketDao;

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
    ticketDao = new Tickets();
  });

  it("Should successfully CREATE a ticket and check its properties", async () => {
    // Crear ticket:
    const ticketData = {
      purchase_datetime: new Date(),
      amount: 5000,
      purchaser: "prueba@gmail.com"
    }


    const ticketDto = new TicketDTO(ticketData);
    const newTicket = await ticketDao.create(ticketDto);

    expect(newTicket).to.be.an("object");
    expect(newTicket).to.have.property("_id");

    // Eliminar ticket de la base de datos:
    const tid = String(newTicket._id);

    await ticketDao.delete(tid);
  })
});
