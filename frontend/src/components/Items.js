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
      </table>
    </div>
  );
}

export default Items;
