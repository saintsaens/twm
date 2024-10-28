import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import '../styles/Items.css';
import { formatCurrency } from "../utils/money";
import { Link } from "react-router-dom";
import { clearCart, deleteCart } from "../store/features/cartSlice";
import { fetchCart } from "../store/features/cartSlice";
import { createOrder } from "../store/features/ordersSlice";
import { generateName } from "../utils/names";


function Cart() {
  const dispatch = useDispatch();
  const { items, totalPrice } = useSelector((state) => state.cart);
  const { userId } = useSelector((state) => state.user.userId);

  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    if (userId) {
      dispatch(fetchCart(userId));
    }
  }, [dispatch, userId]);

  const handleCheckout = () => {
    const nickname = generateName();
    try {
      dispatch(createOrder({ user_id: userId, total_price: totalPrice, items, nickname })).unwrap();
      dispatch(clearCart());
      dispatch(deleteCart(userId));
      setShowMessage(true);
    } catch (error) {
      console.error('Failed to create order:', error);
    }
  };
  

  return (
    <div className="items-container">
      <div className="go-back-link-container">
        <p>
          <Link to="/" className="nav-link">← Go back</Link>
        </p>
      </div>

      <table className="items-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Unit price</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {items.map(({ id, name, price, quantity = 0 }, index) => (
            <tr key={id || index}>
              <td>{name}</td>
              <td>{price}</td>
              <td>{quantity}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="2" style={{ textAlign: 'right', fontWeight: 'bold' }}>Total Price:</td>
            <td>{formatCurrency(totalPrice)}</td>
          </tr>
          <tr>
          </tr>
        </tfoot>
      </table>
      <div className="add-to-cart-container">
        <button className="clear-cart-button" onClick={() => {
          dispatch(clearCart());
          dispatch(deleteCart(userId));
        }}>
          Clear cart
        </button>
        <button className="checkout-button" onClick={handleCheckout}>
          Checkout
        </button>
      </div>
      {showMessage && <p>All items have been shipped to your boss!</p>}
      {showMessage && <p><Link to="/orders">See all orders →</Link></p>}
    </div>
  );
}

export default Cart;
