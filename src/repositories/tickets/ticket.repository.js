import TicketDTO from "../../dtos/ticket.dto.js";

export default class TicketRepository {
  constructor(dao) {
    this.dao = dao;
  }

  createTicket = async (ticket) => {
    try {
      const newTicket = new TicketDTO(ticket);
      const data = await this.dao.create(newTicket);
      return data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  };
}
