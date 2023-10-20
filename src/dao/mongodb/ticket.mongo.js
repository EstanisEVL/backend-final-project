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

  // For tests only:
  delete = async (tid) => {
    try {
      const ticket = await ticketModel.deleteOne({ _id: tid });
      return ticket;
    } catch (err) {
      return err;
    }
  };
}
