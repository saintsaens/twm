import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders } from '../store/features/ordersSlice';
import { useNavigate } from "react-router-dom";

function Orders() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { orders } = useSelector((state) => state.orders);
    const { userId } = useSelector((state) => state.user);

    useEffect(() => {
        if (userId) {
            dispatch(fetchOrders(userId));
        }
    }, [dispatch, userId]);

    const handleRowClick = (id) => {
        navigate(`/orders/${id}`);
    };

    return (
        <div className="fr-table" id="table-md-component">
            <div className="fr-table__wrapper">
                <div className="fr-table__container">
                    <div className="fr-table__content">
                        <table id="table-md">
                            <caption>
                                Orders
                            </caption>
                            <thead>
                                <tr>
                                    <th scope="col">ID</th>
                                    <th scope="col">Nickname</th>
                                    <th scope="col">Date & time</th>
                                    <th scope="col">Paid</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map(({ id, created_at, total_price, nickname }) => (
                                    <tr
                                        key={id}
                                        data-row-key={id}
                                        className="fr-table__row--clickable"
                                        onClick={() => handleRowClick(id)}
                                    >
                                        <td>{id}</td>
                                        <td>{nickname}</td>
                                        <td>{new Date(created_at).toLocaleString()}</td>
                                        <td>{total_price}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Orders;
