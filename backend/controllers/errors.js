export const HTTP_ERRORS = {
    INVALID_CREDENTIALS: "Invalid credentials.",
    MISSING_FIELDS: "Missing required fields.",
    USERNAME_EXISTS: "Username already exists.",
    FORBIDDEN_CART: "Forbidden. You can only access your own cart.",
    NOT_FOUND_CART: "User not found or cart empty.",
    NOT_FOUND_ITEM: "Item not found.",
    NOT_LOGGED_IN: "Unauthorized. You need to be logged in.",
    DATABASE_ERROR: "Database error.",
    INVALID_DATA: "Invalid data format. items must be an array.",
    INVALID_ITEM_QUANTITY: "Invalid item: 'quantity' is required.",
    INVALID_ITEM_ID: "Invalid item: 'id' is required.",
    INVALID_ITEM_FORMATS: "Invalid item: 'id' and 'quantity' must be numbers.",
    ITEM_ID_REQUIRED: "Item ID is required.",
    INVALID_ITEM_ID_FORMAT: "Invalid item ID format. Must be an integer.",
    CART_FAIL: "Failed to retrieve cart.",
    FAIL_REMOVE_ITEMS: "Failed to remove items from cart.",
    FAIL_DELETE_CART: "Failed to delete cart.",
    FAIL_UPDATE_CART: "Failed to update cart.",
    FAIL_CHECKOUT_CART: "Failed to checkout cart.",
    ITEM_NOT_FOUND: "Item not found.",
    FAIL_CREATE_ITEM: "Failed to create item.",
    FAIL_UPDATE_ITEM: "Failed to update item.",
    FAIL_DELETE_ITEM: "Failed to delete item.",
};

export const sendErrorResponse = (res, status, message) => {
    res.status(status).json({ error: message });
};
