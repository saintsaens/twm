import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders } from '../store/features/ordersSlice';

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
        <div>
            <h2>Orders</h2>
            <ul>
                {orders.map(({ id, date }, index) => (
                    <li key={id || index}>
                        Order ID: {id}, Date: {new Date(date).toLocaleDateString()}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Orders;
