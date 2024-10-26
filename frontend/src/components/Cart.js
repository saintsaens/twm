import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import '../styles/Items.css';
import { formatCurrency } from "../utils/money";
import { Link } from "react-router-dom";
import { clearCart, deleteCart } from "../store/features/cartSlice";
import { fetchCart } from "../store/features/cartSlice";


function Cart() {
  const dispatch = useDispatch();
  const { items, totalPrice } = useSelector((state) => state.cart);
  const { userId } = useSelector((state) => state.user.userId);


  useEffect(() => {
    if (userId) {
      dispatch(fetchCart(userId));
    }
  }, [dispatch, userId]);

  return (
    <div>
      <p>
        <Link to="/">← Go back</Link>
      </p>

      <table className="items-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Unit price</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {items.map(({ id, name, price, quantity = 0 }) => (
            <tr key={id}>
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
      <button onClick={() => {
        dispatch(clearCart());
        dispatch(deleteCart(userId));
      }}>
        Clear cart
      </button>
      <button onClick={() => {
        dispatch(clearCart());
        dispatch(deleteCart(userId));
        <p>Hi</p>
      }}>
        Checkout
      </button>
    </div>
  );
}

export default Cart;
