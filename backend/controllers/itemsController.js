import itemsService from "../services/itemsService.js";

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
            return res.status(404).send("Item not found");
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
        if (error.message === 'Missing required fields') {
            return res.status(400).json({ error: error.message });
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
            return res.status(404).send("Item not found");
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
            return res.status(404).send("Item not found");
        }
        res.status(204).send();
    } catch (error) {
        if (error.message === 'Item not found or failed to delete') {
            return res.status(404).json(error.message);
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
