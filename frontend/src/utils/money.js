export function parseMoney(moneyString) {
    return parseFloat(moneyString.replace(/[^0-9.-]+/g, ""));
}

export function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
}
