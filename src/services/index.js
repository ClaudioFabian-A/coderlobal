import CartsRepository from "./repositories/cartRepository.js";
import ProductsRepository from "./repositories/productsRepository.js";
import UsersRepository from "./repositories/userRepository.js";
import TicketRepository from "./repositories/ticketsRepository.js";
import ChatRepository from "./repositories/chatRepository.js";

import PersistenceFactory from "../DAO/PersistenceFactory.js";

const { CartsDao, ProductsDao, TicketsDao, UsersDao, ChatDao } = 
await PersistenceFactory.getPersistence();

export const cartsService = new CartsRepository(new CartsDao());
export const productsService = new ProductsRepository(new ProductsDao());
export const ticketsService = new TicketRepository(new TicketsDao());
export const usersService = new UsersRepository(new UsersDao());
export const chatService = new ChatRepository(new ChatDao());