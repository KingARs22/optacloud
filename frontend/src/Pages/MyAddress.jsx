import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import './MyAddress.css';

const MyAddress = () => {
    const location = useLocation();
    const userId = location.state?.userId;
    const [addresses, setAddresses] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:5000/addresses/${userId}`)
            .then(response => setAddresses(response.data))
            .catch(err => console.error(err));
    }, [userId]);

    const handleFavourite = (id) => {
        axios.patch(`http://localhost:5000/addresses/favourite/${id}`)
            .then(() => {
                setAddresses(prev =>
                    prev.map(addr =>
                        addr._id === id ? { ...addr, isFavourite: true } : addr
                    )
                );
                console.log(`Address ${id} marked as favourite`);
            })
            .catch(err => console.error(err));
    };

    const handleSetCurrent = (id) => {
        axios.patch(`http://localhost:5000/addresses/current/${id}`, { userId })
            .then(() => {
                setAddresses(prev =>
                    prev.map(addr =>
                        addr._id === id
                            ? { ...addr, isCurrent: true }
                            : { ...addr, isCurrent: false }
                    )
                );
                console.log(`Address ${id} set as current`);
            })
            .catch(err => console.error(err));
    };

    const handleDelete = (id) => {
        axios.delete(`http://localhost:5000/addresses/${id}`)
            .then(() => {
                setAddresses(prev => prev.filter(addr => addr._id !== id));
                console.log(`Address ${id} deleted`);
            })
            .catch(err => console.error(err));
    };

    return (
        <div className="my-address-container">
            <h2>Saved Addresses</h2>
            <div className="address-list">
                {addresses.map((addr, index) => (
                    <div key={index} className="address-card">
                        <p><strong> {addr.address.addrName}</strong></p>
                        <p><strong>Place:</strong> {addr.placeName}</p>
                        <p><strong>House No.:</strong> {addr.address.houseNumber}</p>
                        <p><strong>Street:</strong> {addr.address.streetName}</p>
                        <p><strong>Landmark:</strong> {addr.address.landmark}</p>
                        <div className="address-buttons">
                            <button
                                className={addr.isFavourite ? 'favourited' : ''}
                                onClick={() => handleFavourite(addr._id)}>
                                {addr.isFavourite ? 'Favourited' : 'Favourite'}
                            </button>
                            <button
                                className={addr.isCurrent ? 'current' : ''}
                                onClick={() => handleSetCurrent(addr._id)}>
                                {addr.isCurrent ? 'Current Address' : 'Set as Current'}
                            </button>
                            <button className="delete" onClick={() => handleDelete(addr._id)}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>
            <h2>
                <Link to='/home' style={{ textDecoration: 'none' }} state={{ userId }}>
                    Back
                </Link>
            </h2>
        </div>
    );
};

export default MyAddress;
