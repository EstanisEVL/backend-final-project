import { Carts, Products, Users, Tickets } from "../dao/factory.js";
import CartRepository from "./carts/cart.repository.js";
import ProductRepository from "./products/product.repository.js";
import UserRepository from "./users/user.repository.js";
import TicketRepository from "./tickets/ticket.repository.js";

export const CartService = new CartRepository(new Carts());
export const ProductService = new ProductRepository(new Products());
export const UserService = new UserRepository(new Users());
export const TicketService = new TicketRepository(new Tickets());
