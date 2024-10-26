import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { decrement, increment, fetchItems, setRarityFilter, setTypeFilter, clearSelection } from '../store/features/itemsSlice';
import { addItems, updateCart } from "../store/features/cartSlice";
import '../styles/Items.css';
import { parseMoney, formatCurrency } from "../utils/money";
import CartWidget from "./CartWidget";

function Items() {
  const dispatch = useDispatch();
  const { items, rarityFilter, typeFilter } = useSelector((state) => state.items);
  const { userId } = useSelector((state) => state.user.userId);
  const { username } = useSelector((state) => state.user.username);

  useEffect(() => {
    dispatch(fetchItems());
  }, [dispatch]);

  const handleRarityChange = (event) => {
    dispatch(setRarityFilter(event.target.value));
  };

  const handleTypeChange = (event) => {
    dispatch(setTypeFilter(event.target.value));
  };

  const updateQuantity = (itemId, action) => {
    dispatch(action === 'increment' ? increment({ itemId }) : decrement({ itemId }));
  };

  const filteredItems = items.filter(item =>
    (rarityFilter === 'All' || item.rarity === rarityFilter) &&
    (typeFilter === 'All' || item.type === typeFilter)
  );

  const totalPrice = filteredItems.reduce((acc, item) => {
    const itemPrice = parseMoney(item.price);
    const itemQuantity = Number(item.quantity) || 0;
    return acc + itemPrice * itemQuantity;
  }, 0);

  return (
    <div className="items-container">
      {username && (
        <div className="cart-container">
          <CartWidget />
        </div>
      )}
      <div className="filter-container">
        <label htmlFor="rarity-filter">Filter by rarity: </label>
        <select id="rarity-filter" value={rarityFilter} onChange={handleRarityChange}>
          <option value="All">All</option>
          <option value="Common">Common</option>
          <option value="Rare">Rare</option>
          <option value="Legendary">Legendary</option>
        </select>

        <label htmlFor="type-filter">Filter by type: </label>
        <select id="type-filter" value={typeFilter} onChange={handleTypeChange}>
          <option value="All">All</option>
          <option value="Weapon">Weapon</option>
          <option value="Potion">Potion</option>
        </select>
      </div>

      <table className="items-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Rarity</th>
            <th>Unit price</th>
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
          <tr>
          </tr>
        </tfoot>
      </table>
      <div className="add-to-cart-container">
        <button className="add-to-cart-button"
          onClick={() => {
            dispatch(addItems({ items, totalPrice }));
            dispatch(updateCart({ userId, items }));
            dispatch(clearSelection());
          }}>
          Add to cart
        </button>
      </div>
    </div >
  );
}

export default Items;
