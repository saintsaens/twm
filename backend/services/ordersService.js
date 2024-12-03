import { HTTP_ERRORS } from "../controllers/errors.js";
import * as ordersRepository from '../repositories/ordersRepository.js';
import * as usersRepository from "../repositories/usersRepository.js"

export const createOrder = async (userId, totalPrice, items, nickname) => {
  const createdAt = new Date().toISOString();

  if (!totalPrice || !nickname || !items || items.length === 0) {
    throw new Error(HTTP_ERRORS.VALIDATION.MISSING_FIELDS);
  }

  const userCheck = await usersRepository.getUserById(userId);
  if (userCheck.rows.length === 0) {
    throw new Error(HTTP_ERRORS.VALIDATION.INVALID_USER_ID);
  }

  const order = await ordersRepository.insertOrder(userId, totalPrice, createdAt, nickname);
  const orderId = order.rows[0].id;

  await ordersRepository.insertOrderItems(orderId, items);

  return { order: order.rows[0], items };
};

export const getOrdersByUser = async (userId) => {
  const orders = await ordersRepository.getOrdersByUser(userId);
  return orders.rows;
};

export const getOrderDetails = async (orderId, userId) => {
  const orderCheck = await ordersRepository.getOrderById(orderId);
  if (orderCheck.rows.length === 0 || orderCheck.rows[0].user_id !== userId) {
    throw new Error(HTTP_ERRORS.ORDERS.NOT_FOUND);
  }

  const items = await ordersRepository.getOrderItems(orderId);
  return items.rows;
};
