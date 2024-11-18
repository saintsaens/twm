import * as ordersService from '../services/ordersService.js';
import * as usersRepository from "../repositories/usersRepository.js"

export const createOrder = async (req, res) => {
    const userId = parseInt(req.params.userId);
    const { totalPrice, items, nickname } = req.body;

    try {
        if (req.user.id !== userId) {
            return res.status(403).json({ error: 'Forbidden. You can only create an order for yourself.' });
        }
        const order = await ordersService.createOrder(userId, totalPrice, items, nickname);
        res.status(201).json(order);
    } catch (error) {
        if (error.message === 'MISSING_FIELDS') {
            return res.status(400).json({ error: 'Missing required fields or items' });
        }
        if (error.message === 'INVALID_USER') {
            return res.status(400).json({ error: 'Invalid user_id' });
        }
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Failed to create order' });
    }
};

export const getOrdersByUser = async (req, res) => {
    const userId = req.query.user;
    
    try {
        if (req.user.id != userId) {
            return res.status(403).json({ error: 'Forbidden. You can only get your own orders.' });
        }
        const userCheck = await usersRepository.getUserById(userId);
        if (userCheck.rows.length === 0) {
            res.status(400).json({ error: 'User does not exist' });
        }

        const orders = await ordersService.getOrdersByUser(userId);
        res.json(orders);
    } catch (error) {
        console.error('Error retrieving orders:', error);
        res.status(500).json({ error: 'Failed to retrieve orders' });
    }
};

export const getOrderDetails = async (req, res) => {
    const orderId = parseInt(req.params.id);

    try {
        const items = await ordersService.getOrderDetails(orderId, req.user.id);
        res.json(items);
    } catch (error) {
        if (error.message === 'NOT_FOUND_OR_FORBIDDEN') {
            return res.status(404).json({ error: 'Order not found or forbidden' });
        }
        console.error('Error retrieving order:', error);
        res.status(500).json({ error: 'Failed to retrieve order' });
    }
};
