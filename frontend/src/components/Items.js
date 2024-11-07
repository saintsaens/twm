import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setQuantity, fetchItems, setRarityFilter, setTypeFilter, clearSelection } from '../store/features/itemsSlice';
import { addItems, addToCart } from "../store/features/cartSlice";
import { parseMoney, formatCurrency } from "../utils/money";
import CartWidget from "./CartWidget";
import { Link } from "react-router-dom";

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

  const handleQuantityChange = (itemId, quantity) => {
    dispatch(setQuantity({ itemId, quantity }));
  };

  const handleClearFilters = () => {
    dispatch(setRarityFilter('All'));
    dispatch(setTypeFilter('All'));
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
    <>
      {username && <CartWidget />}
      <label htmlFor="rarity-filter">Filter by rarity: </label>
      <select
        id="rarity-filter"
        name="rarity-filter"
        value={rarityFilter}
        onChange={handleRarityChange}
      >
        <option value="All">All</option>
        <option value="Common">Common</option>
        <option value="Rare">Rare</option>
        <option value="Legendary">Legendary</option>
      </select>

      <label htmlFor="type-filter">Filter by type: </label>
      <select
        id="type-filter"
        name="type-filter"
        value={typeFilter}
        onChange={handleTypeChange}
      >
        <option value="All">All</option>
        <option value="Weapon">Weapon</option>
        <option value="Potion">Potion</option>
      </select>
      <Link onClick={handleClearFilters}>Clear</Link>

      <div class="fr-table" id="table-md-component">
        <div class="fr-table__wrapper">
          <div class="fr-table__container">
            <div class="fr-table__content">
              <table id="table-md">
                <caption>
                  Items
                </caption>
                <thead>
                  <tr>
                    <th scope="col">
                      Name
                    </th>
                    <th scope="col">
                      Type
                    </th>
                    <th scope="col">
                      Rarity
                    </th>
                    <th scope="col">
                      Price
                    </th>
                    <th scope="col">
                      Quantity
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredItems.map(({ id, name, type, rarity, price, quantity = 0 }) => (
                    <tr key={id} id={`table-md-row-key-${id}`} data-row-key={id}>
                      <td>{name}</td>
                      <td>{type}</td>
                      <td>{rarity}</td>
                      <td>{price}</td>
                      <td>
                        <select
                          id={`quantity-${id}`}
                          name={`quantity-${id}`}
                          value={quantity}
                          onChange={(e) => handleQuantityChange(id, Number(e.target.value))}
                        >
                          {[...Array(10).keys()].map(i => (
                            <option key={i} value={i}>{i}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <section>
        <p>Total price: {formatCurrency(totalPrice)}</p>
      </section>

      <section>
        <button
          className="fr-btn"
          onClick={() => {
            dispatch(addItems({ items, totalPrice }));
            dispatch(addToCart({ userId, items }));
            dispatch(clearSelection());
          }}
        >
          Add to cart
        </button>
      </section>
    </>
  );
}

export default Items;
