import React, { useState, useEffect } from 'react';
import './Items.css';

function Items() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetch('/api/items/')
      .then((response) => response.json())
      .then((data) => setItems(data))
      .catch((error) => console.error('Error fetching items:', error));
  }, []);

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const filteredItems = items.filter(item => {
    if (filter === 'All') return true;
    return item.rarity === filter;
  });

  const handleQuantityChange = (itemId, change) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, quantity: Math.max(0, (item.quantity || 0) + change) } : item
      )
    );
  };

  return (
    <div className="items-container">
      {/* Dropdown for filtering */}
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
          </tr>
        </thead>
        <tbody>
          {filteredItems.map((item) => (
            <tr key={item.id}>
              <td>
                <div className="name-quantity-container">
                  <span className="item-name">{item.name}</span>
                  <div className="quantity-button">
                    <button onClick={() => handleQuantityChange(item.id, -1)}>-</button>
                    <span>{item.quantity || 0}</span>
                    <button onClick={() => handleQuantityChange(item.id, 1)}>+</button>
                  </div>
                </div>
              </td>
              <td>{item.type}</td>
              <td>{item.rarity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Items;
