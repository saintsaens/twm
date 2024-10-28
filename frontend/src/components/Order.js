import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchOrder } from '../store/features/orderSlice';
import { Link } from "react-router-dom";
import { fetchOrders } from "../store/features/ordersSlice";

const Order = () => {
    const { id } = useParams();
    const dispatch = useDispatch();

    const { order } = useSelector((state) => state.order);
    const { orders } = useSelector((state) => state.orders);
    const { userId } = useSelector((state) => state.user.userId);
    const currentOrder = orders.find((order) => order.id === Number(id));
    const date = currentOrder ? new Date(currentOrder.created_at).toLocaleString() : "Date not available";
    const totalPrice = currentOrder ? currentOrder.total_price : null;


    useEffect(() => {
        if (id) {
            dispatch(fetchOrder(id));
        }
        if (userId) {
            dispatch(fetchOrders(userId));
        }
    }, [dispatch, id, userId]);


    return (
        <div className="items-container">
            <div className="go-back-link-container">
                <p>
                    <Link to="/orders" className="nav-link">← All orders</Link>
                </p>
            </div>
            <h2>Order {id}</h2>
            <p>Paid on {date}</p>
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
                <tfoot>
                    <tr>
                        <td colSpan="2" style={{ textAlign: 'right', fontWeight: 'bold' }}>Total Price:</td>
                        <td>{totalPrice}</td>
                    </tr>
                    <tr>
                    </tr>
                </tfoot>
            </table>
        </div>
    );
};

export default Order;
