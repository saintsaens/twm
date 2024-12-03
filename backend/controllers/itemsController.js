import itemsService from "../services/itemsService.js";
import { HTTP_ERRORS, sendErrorResponse } from "./errors.js";

const getItems = async (req, res, next) => {
    try {
        const filters = req.query;
        const items = await itemsService.getItems(filters);
        res.json(items);
    } catch (error) {
        next(error);
    }
};

const getItemById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const item = await itemsService.getItemById(id);
        if (!item) {
            return sendErrorResponse(res, 404, HTTP_ERRORS.ITEM.NOT_FOUND);
        }
        res.json(item);
    } catch (error) {
        next(error);
    }
};

const createItem = async (req, res, next) => {
    try {
        const newItem = req.body;
        const createdItem = await itemsService.createItem(newItem);
        res.status(201).json(createdItem);
    } catch (error) {
        if (error.message === HTTP_ERRORS.VALIDATION.MISSING_FIELDS) {
            return sendErrorResponse(res, 400, HTTP_ERRORS.VALIDATION.MISSING_FIELDS);
        }
        next(error);
    }
};

const updateItem = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updatedFields = req.body;
        const updatedItem = await itemsService.updateItem(id, updatedFields);
        if (!updatedItem) {
            return sendErrorResponse(res, 404, HTTP_ERRORS.ITEM.NOT_FOUND);
        }
        res.json(updatedItem);
    } catch (error) {
        next(error);
    }
};

const deleteItem = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deleted = await itemsService.deleteItem(id);
        if (!deleted) {
            return sendErrorResponse(res, 404, HTTP_ERRORS.ITEM.NOT_FOUND);
        }
        res.status(204).send();
    } catch (error) {
        if (error.message === HTTP_ERRORS.ITEM.FAIL_DELETE) {
            return sendErrorResponse(res, 404, HTTP_ERRORS.ITEM.FAIL_DELETE);
        }
        next(error);
    }
};

export default {
    getItems,
    getItemById,
    createItem,
    updateItem,
    deleteItem,
};