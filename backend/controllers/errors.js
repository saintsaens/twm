export const HTTP_ERRORS = {
    AUTH: {
        INVALID_CREDENTIALS: "Invalid credentials.",
        NOT_LOGGED_IN: "Unauthorized. You need to be logged in.",
        ADMINS_ONLY: "Unauthorized. Admins only.",
    },
    VALIDATION: {
        MISSING_FIELDS: "Missing required fields.",
        INVALID_DATA: "Invalid data format. Items must be an array.",
        INVALID_ITEM_QUANTITY: "Invalid item: 'quantity' is required.",
        INVALID_ITEM_ID: "Invalid item: 'id' is required.",
        INVALID_USER_ID: "Invalid user ID.",
        INVALID_ITEM_FORMATS: "Invalid item: 'id' and 'quantity' must be numbers.",
        ITEM_ID_REQUIRED: "Item ID is required.",
        INVALID_ITEM_ID_FORMAT: "Invalid item ID format. Must be an integer.",
    },
    CART: {
        FORBIDDEN: "Forbidden. You can only access your own cart.",
        NOT_FOUND: "User not found or cart empty.",
        CART_FAIL: "Failed to retrieve cart.",
        FAIL_REMOVE_ITEMS: "Failed to remove items from cart.",
        FAIL_DELETE: "Failed to delete cart.",
        FAIL_UPDATE: "Failed to update cart.",
        FAIL_CHECKOUT: "Failed to checkout cart.",
    },
    ITEM: {
        NOT_FOUND: "Item not found.",
        FAIL_CREATE: "Failed to create item.",
        FAIL_UPDATE: "Failed to update item.",
        FAIL_DELETE: "Failed to delete item.",
    },
    ORDERS: {
        NOT_FOUND: "Order not found or forbidden.",
        FORBIDDEN: "Forbidden. You can only create an order for yourself.",
        FAIL_CREATE: "Failed to create order.",
        FAIL_RETRIEVE: "Failed to retrieve orders.",
    },
    USERS: {
        NOT_FOUND: "User not found.",
        FORBIDDEN: "Forbidden. You can only access your own data.",
        NO_UPDATE: "Nothing to update.",
        FAIL_RETRIEVE: "Failed to retrieve users.",
        FAIL_UPDATE: "Failed to update user.",
        FAIL_DELETE: "Failed to update user.",
    },
    GENERAL: {
        USERNAME_EXISTS: "Username already exists.",
        DATABASE_ERROR: "Database error.",
        NO_CONTENT: "No content."
    },
};

export const sendErrorResponse = (res, status, message) => {
    res.status(status).json({ error: message });
};
