import React from 'react';
import { useSelector } from 'react-redux';
import '../styles/Cart.css';
import { formatCurrency } from "../utils/money";
import { Link } from "react-router-dom";


function Cart() {
  const { items, totalPrice } = useSelector((state) => state.cart);

  return (
    <div className="items-container">
      <p className="signup-link">
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
    </div>
  );
}

export default Cart;
