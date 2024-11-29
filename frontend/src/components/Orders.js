import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders } from '../store/features/ordersSlice';
import { Link, useNavigate } from "react-router-dom";

function Orders() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { orders, loading, error } = useSelector((state) => state.orders);
    const { userId } = useSelector((state) => state.user);

    useEffect(() => {
        if (userId) {
            dispatch(fetchOrders(userId));
        }
    }, [dispatch, userId]);

    const handleView = (id) => {
        navigate(`/orders/${id}`);
    };

    return (
        <>
            <h1>Your orders</h1>
            <Link to="/" className="fr-link">← Go back</Link>

            {
                loading ? (
                    <div className="fr-empty-state">
                        <p>Loading…</p>
                    </div>
                ) : error ? (
                    <div className="fr-empty-state">
                        <p>Error loading orders! 😬</p>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="fr-empty-state">
                        <p>No orders.</p>
                        <Link to="/" className="fr-link">← Go back</Link>
                    </div>
                ) : (
                    <>
                        <div className="fr-table" id="table-md-component">
                            <div className="fr-table__wrapper">
                                <div className="fr-table__container">
                                    <div className="fr-table__content">
                                        <table id="table-md">
                                            <thead>
                                                <tr>
                                                    <th scope="col">ID</th>
                                                    <th scope="col">Nickname</th>
                                                    <th scope="col">Date & time</th>
                                                    <th scope="col">Paid</th>
                                                    <th scope="col">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {orders.map(({ id, created_at, total_price, nickname }) => (
                                                    <tr
                                                        key={id}
                                                        data-row-key={id}
                                                        className="fr-table__row--clickable"
                                                    >
                                                        <td>{id}</td>
                                                        <td>{nickname}</td>
                                                        <td>{new Date(created_at).toLocaleString()}</td>
                                                        <td>{total_price}</td>
                                                        <td>
                                                            <button
                                                                className="fr-btn fr-btn--secondary fr-btn--sm"
                                                                onClick={() => handleView(id)}
                                                            >
                                                                View
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
        </>
    );
}

export default Orders;
