import * as ordersService from '../services/ordersService.js';
import * as usersRepository from "../repositories/usersRepository.js";
import { sendErrorResponse } from "./errors.js";
import { HTTP_ERRORS } from "./errors.js";

export const createOrder = async (req, res) => {
    const userId = parseInt(req.params.userId);
    const { totalPrice, items, nickname } = req.body;

    try {
        if (req.user.id !== userId) {
            return sendErrorResponse(res, 403, HTTP_ERRORS.ORDERS.FORBIDDEN);
        }
        const order = await ordersService.createOrder(userId, totalPrice, items, nickname);
        res.status(201).json(order);
    } catch (error) {
        if (error.message === HTTP_ERRORS.VALIDATION.MISSING_FIELDS) {
            return sendErrorResponse(res, 400, HTTP_ERRORS.VALIDATION.MISSING_FIELDS);
        }
        if (error.message === HTTP_ERRORS.VALIDATION.INVALID_USER_ID) {
            return sendErrorResponse(res, 400, HTTP_ERRORS.VALIDATION.INVALID_USER_ID);
        }
        return sendErrorResponse(res, 500, HTTP_ERRORS.ORDERS.FAIL_CREATE);
    }
};

export const getOrdersByUser = async (req, res) => {
    const userId = req.query.user;

    try {
        if (req.user.id != userId) {
            return sendErrorResponse(res, 403, HTTP_ERRORS.ORDERS.NOT_FOUND);
        }
        const userCheck = await usersRepository.getUserById(userId);
        if (userCheck.rows.length === 0) {
            return sendErrorResponse(res, 400, HTTP_ERRORS.USERS.NOT_FOUND);
        }

        const orders = await ordersService.getOrdersByUser(userId);
        res.json(orders);
    } catch {
        return sendErrorResponse(res, 500, HTTP_ERRORS.ORDERS.FAIL_RETRIEVE);
    }
};

export const getOrderDetails = async (req, res) => {
    const orderId = parseInt(req.params.id);

    try {
        const items = await ordersService.getOrderDetails(orderId, req.user.id);
        res.json(items);
    } catch (error) {
        if (error.message === HTTP_ERRORS.ORDERS.NOT_FOUND) {
            return sendErrorResponse(res, 404, HTTP_ERRORS.ORDERS.NOT_FOUND);
        }
        return sendErrorResponse(res, 500, HTTP_ERRORS.ORDERS.FAIL_RETRIEVE);
    }
};
