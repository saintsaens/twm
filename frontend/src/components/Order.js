import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchOrder } from '../store/features/orderSlice';
import { Link } from "react-router-dom";

const Order = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  
  const { order } = useSelector((state) => state.order);

  useEffect(() => {
    if (id) {
      dispatch(fetchOrder(id));
    }
  }, [dispatch, id]);


  return (
    <div className="items-container">
            <div className="go-back-link-container">
                <p>
                    <Link to="/orders">← All orders</Link>
                </p>
            </div>
            <h2>Order {id}</h2>
            <table className="items-table">
                <thead>
                    <tr>
                        <th>Item name</th>
                        <th>Item price</th>
                        <th>Item quantity</th>
                    </tr>
                </thead>
                <tbody>
                {order.map(({ item_id, name, price, quantity }, index) => (
                        <tr key={item_id || index}>
                            <td>{name}</td>
                            <td>{price}</td>
                            <td>{quantity}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
  );
};

export default Order;
