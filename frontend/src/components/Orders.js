import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders } from '../store/features/ordersSlice';
import '../styles/Items.css';
import { Link } from "react-router-dom";

function Orders() {
    const dispatch = useDispatch();
    const { orders } = useSelector((state) => state.orders);
    const { userId } = useSelector((state) => state.user.userId);

    useEffect(() => {
        if (userId) {
            dispatch(fetchOrders(userId));
        }
    }, [dispatch, userId]);

    return (
        <div className="items-container">
            <div className="go-back-link-container">
                <p>
                    <Link to="/">← Go back</Link>
                </p>
            </div>
            <h2>Orders</h2>
            <table className="items-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Date (your timezone 🕐🤓)</th>
                        <th>Paid 💸</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(({ id, created_at, total_price }, index) => (
                        <tr key={id || index}>
                            <td>{id}</td>
                            <td>{new Date(created_at).toLocaleString()}</td>
                            <td>{total_price}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

    );
}

export default Orders;
