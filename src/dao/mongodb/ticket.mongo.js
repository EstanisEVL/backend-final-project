import ticketModel from "../../models/ticket.model.js";

export default class Tickets {
  create = async (ticketBody) => {
    try {
      const ticket = await ticketModel.create(ticketBody);
      return ticket;
    } catch (err) {
      console.log(err);
    }
  };
}
