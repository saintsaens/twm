import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders } from '../store/features/ordersSlice';
import '../styles/Items.css';
import { Link, useNavigate } from "react-router-dom";

function Orders() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { orders } = useSelector((state) => state.orders);
    const { userId } = useSelector((state) => state.user.userId);

    useEffect(() => {
        if (userId) {
            dispatch(fetchOrders(userId));
        }
    }, [dispatch, userId]);

    const handleRowClick = (id) => {
        navigate(`/orders/${id}`);
    };

    return (
        <div className="items-container">
            <div className="go-back-link-container">
                <p>
                    <Link to="/">← Home</Link>
                </p>
            </div>
            <h2>Orders</h2>
            <table className="items-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Date & time (your timezone 🕐🤓)</th>
                        <th>Paid 💸</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(({ id, created_at, total_price }, index) => (
                        <tr key={id || index}
                            onClick={() => handleRowClick(id)}
                            className="table-row-clickable"
                        >
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
