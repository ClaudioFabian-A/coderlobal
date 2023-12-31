import ticketModel from "./models/ticketsModels.js";

export default class TicketsDao {
    getTickets = (params) => {
        return ticketModel.find(params).lean();
    };
    getTicketsBy = (params) => {
        return ticketModel.findOne(params).lean();
    };

    createTicket = (ticket) => {
        return ticketModel.create(ticket);
    };

    updateTicket = (id, ticket) => {
        return ticketModel.updateOne({ _id: id }, { $set: ticket });
    };

    deleteTicket = (id) => {
        return ticketModel.deleteOne({ _id: id });
    };
}