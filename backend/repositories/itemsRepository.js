import * as db from "../db/index.js";

const findItems = async (filters) => {
    let query = "SELECT * FROM items WHERE TRUE";
    const params = [];
    let index = 1;

    if (filters.type) {
        query += ` AND type::text ILIKE $${index++}`;
        params.push(filters.type);
    }

    if (filters.rarity) {
        query += ` AND rarity::text ILIKE $${index++}`;
        params.push(filters.rarity);
    }
    const result = await db.query(query, params);
    return result.rows;
};

const findItemById = async (id) => {
    const query = "SELECT * FROM items WHERE id = $1";
    const result = await db.query(query, [id]);
    return result.rows[0];
};

const insertItem = async ({ name, type, rarity, price }) => {
    const query = `
    INSERT INTO items (name, type, rarity, price)
    VALUES ($1, $2::item_type, $3::rarity_type, $4::money)
    RETURNING *;
  `;
    const result = await db.query(query, [name, type, rarity, price]);
    return result.rows[0];
};

const updateItem = async (id, { name, type, rarity, price }) => {
    const query = `
    UPDATE items
    SET 
      name = COALESCE($1, name),
      type = COALESCE($2::item_type, type),
      rarity = COALESCE($3::rarity_type, rarity),
      price = COALESCE($4::money, price)
    WHERE id = $5
    RETURNING *;
  `;
    const result = await db.query(query, [
        name || null,
        type || null,
        rarity || null,
        price || null,
        id,
    ]);
    return result.rows[0];
};

const deleteItem = async (id) => {
    const query = "DELETE FROM items WHERE id = $1 RETURNING *;";
    const result = await db.query(query, [id]);
    if (!result || !result.rows || result.rows.length === 0) {
        throw new Error('Item not found or failed to delete');
    }
    return result.rows[0];
};

export default {
    findItems,
    findItemById,
    insertItem,
    updateItem,
    deleteItem,
};