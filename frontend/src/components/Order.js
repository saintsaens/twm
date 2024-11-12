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
    const { userId } = useSelector((state) => state.user);
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
        <>
            <h1>
                Order {id}
            </h1>
            <Link to="/orders" className="fr-link">← All orders</Link>
            <div className="fr-table" >
                <div className="fr-table" id="table-md-component">
                    <div className="fr-table__wrapper">
                        <div className="fr-table__container">
                            <div className="fr-table__content">
                                <table id="table-md">
                                    <caption>
                                        {date}
                                    </caption>
                                    <thead>
                                        <tr>
                                            <th scope="col">Item name</th>
                                            <th scope="col">Item price</th>
                                            <th scope="col">Item quantity</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {order.map(({ item_id, name, price, quantity }) => (
                                            <tr key={item_id}>
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
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Order;
