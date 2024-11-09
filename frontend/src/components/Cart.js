import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { formatCurrency } from "../utils/money";
import { Link } from "react-router-dom";
import { clearCart, deleteCart, removeFromCart, removeItem } from "../store/features/cartSlice";
import { fetchCart } from "../store/features/cartSlice";
import { createOrder } from "../store/features/ordersSlice";
import { generateName } from "../utils/names";


function Cart() {
  const dispatch = useDispatch();
  const { items, totalPrice } = useSelector((state) => state.cart);
  const { userId } = useSelector((state) => state.user);

  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    if (userId) {
      dispatch(fetchCart(userId));
    }
  }, [dispatch, userId]);

  const handleClear = () => {
    dispatch(clearCart());
    dispatch(deleteCart(userId));
  };

  const handleCheckout = () => {
    const nickname = generateName();
    try {
      dispatch(createOrder({ userId, totalPrice, items, nickname })).unwrap();
      dispatch(clearCart());
      dispatch(deleteCart(userId));
      setShowMessage(true);
    } catch (error) {
      console.error('Failed to create order:', error);
    }
  };

  const handleRemove = (itemId) => {
    dispatch(removeItem({ itemId }));
    dispatch(removeFromCart({ userId, itemId }));
  };


  return (
    <>
      <h1>Cart</h1>
      <Link to="/">← Go back</Link>

      <div className="fr-table" id="table-md-component">
        <div className="fr-table__wrapper">
          <div className="fr-table__container">
            <div className="fr-table__content">
              <table id="table-md">
                <thead>
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Unit price</th>
                    <th scope="col">Quantity</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(({ item_id, name, price, quantity = 0 }, index) => (
                    <tr key={item_id || index} id={`table-md-row-key-${item_id}`} data-row-key={item_id}>
                      <td>{name}</td>
                      <td>{price}</td>
                      <td>{quantity}</td>
                      <td>
                        <button
                          className="fr-btn fr-btn--secondary fr-btn--sm"
                          onClick={() => handleRemove(item_id)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <p>Total price: {formatCurrency(totalPrice)}</p>

      {totalPrice > 0 && (
        <div>
          <button
            className="fr-btn fr-btn--secondary"
            onClick={handleClear}
          >
            Clear cart
          </button>
          <button
            className="fr-btn"
            onClick={handleCheckout}
          >
            Checkout
          </button>
        </div>
      )}
      {showMessage && (
        <>
          <p>All items have been shipped to your boss!</p>
          <p><Link to="/orders">See all orders →</Link></p>
        </>
      )}
    </>
  );
}

export default Cart;
