import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { decrement, increment, fetchItems, setFilter } from '../store/features/itemsSlice';
import '../styles/Items.css';

function Items() {
  const dispatch = useDispatch();
  const { items, filter } = useSelector((state) => state.items);

  useEffect(() => {
    dispatch(fetchItems());
  }, [dispatch]);

  const handleFilterChange = (event) => {
    dispatch(setFilter(event.target.value));
  };

  const updateQuantity = (itemId, action) => {
    dispatch(action === 'increment' ? increment({ itemId }) : decrement({ itemId }));
  };

  const filteredItems = items.filter(item =>
    filter === 'All' || item.rarity === filter
  );

  function parseMoney(moneyString) {
    return parseFloat(moneyString.replace(/[^0-9.-]+/g, ""));
  }

  function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  }

  const totalPrice = filteredItems.reduce((acc, item) => {
    const itemPrice = parseMoney(item.price);
    const itemQuantity = Number(item.quantity) || 0; // Convert to number

    console.log('Item Price:', itemPrice, 'Item Quantity:', itemQuantity); // Log for debugging

    return acc + itemPrice * itemQuantity;
  }, 0);


  return (
    <div className="items-container">
      <div className="filter-container">
        <label htmlFor="rarity-filter">Filter by rarity: </label>
        <select id="rarity-filter" value={filter} onChange={handleFilterChange}>
          <option value="All">All</option>
          <option value="Common">Common</option>
          <option value="Rare">Rare</option>
          <option value="Legendary">Legendary</option>
        </select>
      </div>

      <table className="items-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Rarity</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.map(({ id, name, type, rarity, price, quantity = 0 }) => (
            <tr key={id}>
              <td>
                <div className="name-quantity-container">
                  <span className="item-name">{name}</span>
                  <div className="quantity-button">
                    <button onClick={() => updateQuantity(id, 'decrement')}>-</button>
                    <span>{quantity}</span>
                    <button onClick={() => updateQuantity(id, 'increment')}>+</button>
                  </div>
                </div>
              </td>
              <td>{type}</td>
              <td>{rarity}</td>
              <td>{price}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="3" style={{ textAlign: 'right', fontWeight: 'bold' }}>Total Price:</td>
            <td>{formatCurrency(totalPrice)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export default Items;
