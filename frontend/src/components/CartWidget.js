import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from "react-redux";
import { fetchCart } from "../store/features/cartSlice";
import { formatCurrency } from "../utils/money";
import { Link } from "react-router-dom";

function CartWidget() {
  const dispatch = useDispatch();
  const { items, totalPrice } = useSelector((state) => state.cart);
  const { userId } = useSelector((state) => state.user);


  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    if (userId) {
      dispatch(fetchCart(userId));
    }
  }, [dispatch, userId]);

  return (
    <section>
      <aside>
        <p>Items in cart: {totalItems}</p>
        <p>
          Total price: {formatCurrency(totalPrice)}
        </p>
        <Link to="/cart">View cart</Link>
      </aside>
    </section>
  );
}

export default CartWidget;
