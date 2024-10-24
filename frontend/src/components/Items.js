import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { decrement, increment, fetchItems, setFilter } from '../store/features/itemsSlice'
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

  const addOne = (itemId) => {
    dispatch(increment({ itemId }));
  };

  const removeOne = (itemId) => {
    dispatch(decrement({ itemId }));
  };

  const filteredItems = items.filter(item => {
    if (filter === 'All') return true;
    return item.rarity === filter;
  });

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
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.map((item) => (
            <tr key={item.id}>
              <td>
                <div className="name-quantity-container">
                  <span className="item-name">{item.name}</span>
                  <div className="quantity-button">
                    <button onClick={() => removeOne(item.id)}>-</button>
                    <span>{item.quantity || 0}</span>
                    <button onClick={() => addOne(item.id)}>+</button>
                  </div>
                </div>
              </td>
              <td>{item.type}</td>
              <td>{item.rarity}</td>
              <td>{item.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Items;
