import React, { useState, useEffect } from 'react';
import { useLocation, Link,useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Home.css';

const Home = () => {
  const navigate = useNavigate()
  const location = useLocation();
  const [userName, setUserName] = useState('');
  const userId = location.state?.userId;
  const [addresses, setAddresses] = useState([]);
  const [currentAddress, setCurrentAddress] = useState(null);
  const [favAddress, setFavAddress] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/user/${userId}`) 
      .then(response => {
        setUserName(response.data.name);
        console.log(response) 
      })
      .catch(err => console.error(err));

    axios.get(`http://localhost:5000/addresses/${userId}`)
      .then(response => {
        setAddresses(response.data);
        // Filter the addresses for current and favourite ones
        const currentAddr = response.data.find(addr => addr.isCurrent);
        setCurrentAddress(currentAddr);
        const favAddr = response.data.find(addr => addr.isFavourite);
        setFavAddress(favAddr);
        console.log(response.data);
      })
      .catch(err => console.error(err));
  }, [userId]);

  const handlelogout = () => {
    navigate('/'); // Navigate to home page on cancel
  };

  return (
    <div className="home-container">
      <div className="navbar">
        <div className="navlogo">
          <p>AddressTray</p>
        </div>
        <ul className="nav-menu">
          <li><Link to="/myaddress" state={{ userId }} style={{ textDecoration: 'none' }}>My Addresses</Link></li>
          <li><Link to="/maps" state={{ userId }} style={{ textDecoration: 'none' }}>Add New Address</Link></li>
          <li>{userName ? userName : 'Loading...'}</li>
        </ul>
        <div className="nav-login-cart">
          <button onClick={handlelogout}>Logout</button>
        </div>
      </div>

      <div className="address-list">
        <h2>Current Address</h2>
        <div>
          {currentAddress ? (
            <div className="list">
              <p><strong> {currentAddress.address.addrName}</strong></p>
              <p><strong>Place:</strong> {currentAddress.placeName}</p>
              <p><strong>House No.:</strong> {currentAddress.address.houseNumber}</p>
              <p><strong>Street:</strong> {currentAddress.address.streetName}</p>
              <p><strong>Landmark:</strong> {currentAddress.address.landmark}</p>
            </div>
          ) : (
            <p>No current address found.</p>
          )}
        </div>
      </div>

      <div className="address-list">
        <h2>Favourite Address</h2>
        <div>
          {favAddress ? (
            <div className="list">
              <p><strong> {favAddress.address.addrName}</strong></p>
              <p><strong>Place:</strong> {favAddress.placeName}</p>
              <p><strong>House No.:</strong> {favAddress.address.houseNumber}</p>
              <p><strong>Street:</strong> {favAddress.address.streetName}</p>
              <p><strong>Landmark:</strong> {favAddress.address.landmark}</p>
            </div>
          ) : (
            <p>No favourite address found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
