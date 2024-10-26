import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from "react-redux";
import { clearCart, fetchCart, deleteCart } from "../store/features/cartSlice";
import { formatCurrency } from "../utils/money";

function Cart() {
  const dispatch = useDispatch();
  const { items, totalPrice } = useSelector((state) => state.cart);
  const { userId } = useSelector((state) => state.user.userId);


  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    if (userId) {
      dispatch(fetchCart(userId));
    }
  }, [dispatch, userId]);

  return (
    <div>
      <p>Items in cart: {totalItems}</p>
      <p>Total price: {formatCurrency(totalPrice)}</p>
      <button>
        View cart
      </button>
      <button onClick={() => {
        dispatch(clearCart());
        dispatch(deleteCart(userId));
      }}>
        Clear cart
      </button>
    </div>
  );
}

export default Cart;
