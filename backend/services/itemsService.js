import itemsRepository from "../repositories/itemsRepository.js";

const getItems = async (filters) => {
  const { type, rarity } = filters;
  const queryFilters = {};
  if (type) queryFilters.type = type;
  if (rarity) queryFilters.rarity = rarity;
  return itemsRepository.findItems(queryFilters);
};

const getItemById = async (id) => {
  return itemsRepository.findItemById(id);
};

const createItem = async (newItem) => {
  const { name, type, rarity, price } = newItem;
  if (!name || !type || !rarity || !price) {
    throw new Error("Missing required fields");
  }
  return itemsRepository.insertItem({ name, type, rarity, price });
};

const updateItem = async (id, updatedFields) => {
  return itemsRepository.updateItem(id, updatedFields);
};

const deleteItem = async (id) => {
  return itemsRepository.deleteItem(id);
};

export default {
  getItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
};
