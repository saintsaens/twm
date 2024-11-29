import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setQuantity, fetchItems, setRarityFilter, setTypeFilter, clearSelection } from '../store/features/itemsSlice';
import { addToCart } from "../store/features/cartSlice";
import { parseMoney, formatCurrency } from "../utils/money";
import "../styles/App.css"
import { useNavigate } from "react-router-dom";

function Items() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, rarityFilter, typeFilter } = useSelector((state) => state.items);
  const { userId } = useSelector((state) => state.user);

  const [sortColumn, setSortColumn] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');

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
    setSearchTerm('');
  };

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortOrder('asc');
    }
  };

  const filteredItems = items.filter(item =>
    (rarityFilter === 'All' || item.rarity === rarityFilter) &&
    (typeFilter === 'All' || item.type === typeFilter) &&
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedItems = [...filteredItems]
    .sort((a, b) => {
      const valueA = a[sortColumn];
      const valueB = b[sortColumn];

      if (sortColumn === 'price') {
        return sortOrder === 'asc'
          ? parseMoney(valueA) - parseMoney(valueB)
          : parseMoney(valueB) - parseMoney(valueA);
      }

      if (valueA < valueB) return sortOrder === 'asc' ? -1 : 1;
      if (valueA > valueB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  const totalPrice = filteredItems.reduce((acc, item) => {
    const itemPrice = parseMoney(item.price);
    const itemQuantity = Number(item.quantity) || 0;
    return acc + itemPrice * itemQuantity;
  }, 0);

  return (
    <>
      <h1>Items</h1>
      <div className="fr-select-group-container">
        <div className="fr-select-group">
          <label className="fr-label" htmlFor="rarity-filter">Filter by rarity</label>
          <select
            className="fr-select"
            id="rarity-filter"
            name="rarity-filter"
            value={rarityFilter}
            onChange={handleRarityChange}
          >
            <option value="All">All</option>
            <option value="Common">Common</option>
            <option value="Uncommon">Uncommon</option>
            <option value="Rare">Rare</option>
            <option value="Epic">Epic</option>
            <option value="Legendary">Legendary</option>
          </select>
        </div>

        <div className="fr-select-group">
          <label className="fr-label" htmlFor="type-filter">Filter by type</label>
          <select
            className="fr-select"
            id="type-filter"
            name="type-filter"
            value={typeFilter}
            onChange={handleTypeChange}
          >
            <option value="All">All</option>
            <option value="Weapon">Weapon</option>
            <option value="Armor">Armor</option>
            <option value="Potion">Potion</option>
            <option value="Bomb">Bomb</option>
          </select>
        </div>

        <div className="fr-clear-container">
          <button className="fr-btn fr-btn--secondary" onClick={handleClearFilters}>Clear</button>
        </div>
      </div>

      <div className="fr-search-bar" id="header-search" role="search">
        <label className="fr-label" for="search-input">
          Recherche
        </label>
        <input
          className="fr-input"
          placeholder="Rechercher"
          type="search"
          id="search-input"
          name="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="fr-btn" title="Rechercher">
          Rechercher
        </button>
      </div>


      <div className="fr-table" id="table-md-component">
        <div className="fr-table__header">
        </div>
        <div className="fr-table__wrapper">
          <div className="fr-table__container">
            <div className="fr-table__content">
              <table id="table-md">
                <thead>
                  <tr>
                    <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>
                      Name {sortColumn === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                    <th onClick={() => handleSort('type')} style={{ cursor: 'pointer' }}>
                      Type {sortColumn === 'type' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                    <th onClick={() => handleSort('rarity')} style={{ cursor: 'pointer' }}>
                      Rarity {sortColumn === 'rarity' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                    <th onClick={() => handleSort('price')} style={{ cursor: 'pointer' }}>
                      Price {sortColumn === 'price' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                    <th>Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedItems.map(({ id, name, type, rarity, price, quantity = 0 }) => (
                    <tr key={id} id={`table-md-row-key-${id}`} data-row-key={id}>
                      <td>{name}</td>
                      <td>{type}</td>
                      <td>{rarity}</td>
                      <td>{price}</td>
                      <td>
                        <select
                          className="fr-select"
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
      <div className="fr-table-footer">
        <div className="fr-table-footer__content">
          <p className="fr-text--bold fr-mb-0">Total price: {formatCurrency(totalPrice)}</p>
          <button
            className="fr-btn fr-ml-2w"
            onClick={() => {
              dispatch(addToCart({ userId, items }));
              dispatch(clearSelection());
              navigate("/cart");
            }}
            disabled={!userId}
          >
            {userId ? `Add to cart` : `Log in to add to cart`}
          </button>
        </div>
      </div>
    </>
  );

}

export default Items;
