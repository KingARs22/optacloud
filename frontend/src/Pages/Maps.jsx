import React, { useState, useRef } from 'react';
import { Link,useLocation, useNavigate } from 'react-router-dom';
import './Maps.css';
import axios from 'axios';
import { GoogleMap, LoadScript, Marker, Autocomplete } from "@react-google-maps/api";

// Modal for location access
const Modal = ({ onEnableLocation, onSearchManually, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Location Access</h2>
        <p>Would you like to enable location access or search manually?</p>
        <button onClick={onEnableLocation} className="modal-button">
          Enable Location Access
        </button>
        <button onClick={onSearchManually} className="modal-button">
          Search Manually
        </button>
        <button onClick={onClose} className="modal-close-button">
          Close
        </button>
      </div>
    </div>
  );
};

// Modal for saving address (house number, street, landmark)
const SaveAddressModal = ({ onClose, onSaveAddress, placeName, userLocation }) => {
  const [addrName, setAddrName] = useState("");
  const [houseNumber, setHouseNumber] = useState("");
  const [streetName, setStreetName] = useState("");
  const [landmark, setLandmark] = useState("");

  const handleSave = () => {
    if (!houseNumber || !streetName || !landmark) {
      alert("Please fill in all fields");
      return;
    }

    const fullAddress = {
      addrName,
      houseNumber,
      streetName,
      landmark,
      placeName,
      userLocation,
    };
    onSaveAddress(fullAddress);
  };

  return (
    <div className="save-address-modal-overlay">
      <div className="save-address-modal-content">
        <h2>Enter Address Details</h2>
        <input
          type="text"
          placeholder="Home, Work, etc"
          value={addrName}
          onChange={(e) => setAddrName(e.target.value)}
        />
        <input
          type="text"
          placeholder="House No."
          value={houseNumber}
          onChange={(e) => setHouseNumber(e.target.value)}
        />
        <input
          type="text"
          placeholder="Street Name"
          value={streetName}
          onChange={(e) => setStreetName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Landmark"
          value={landmark}
          onChange={(e) => setLandmark(e.target.value)}
        />
        <div className="modal-buttons">
          <button onClick={handleSave}>Save Address</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

const Maps = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userId = location.state?.userId;
  const [userLocation, setUserLocation] = useState({ lat: 28.7041, lng: 77.1025 });
  const [errorMessage, setErrorMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showSaveAddressModal, setShowSaveAddressModal] = useState(false);
  const [markerPosition, setMarkerPosition] = useState(userLocation);
  const [placeName, setPlaceName] = useState("");
  const autocompleteRef = useRef(null);

  const handleCancel = () => {
    navigate('/home',{ state: { userId } }); // Navigate to home page on cancel
  };

  const handleAddress = () => {
    if (!placeName || !userLocation) {
      setErrorMessage("Error: Please select a valid location.");
      return;
    }
    setShowSaveAddressModal(true);  // Show the address input modal when the button is clicked
  };

  const handleSaveAddress = (address) => {
    console.log(address)
    axios.post('http://localhost:5000/newaddress', {userId,placeName,userLocation, address})
      .then(result => {
        console.log(result);
        setShowSaveAddressModal(false); // Close the modal after saving the address
        navigate('/home', { state: { userId } });
      })
      .catch(err => console.log(err));
  };

  const containerStyle = {
    width: "100%",
    height: "80vh",
  };

  const handleLocateMe = () => {
    setShowModal(true);
  };

  const enableLocationAccess = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(pos);
          setMarkerPosition(pos);
          setPlaceName("");
          console.log(pos);
        },
        () => {
          setErrorMessage("Error: The Geolocation service failed.");
        }
      );
    } else {
      setErrorMessage("Error: Your browser doesn't support geolocation.");
    }
    setShowModal(false);
  };

  const searchManually = () => {
    setShowModal(false);
  };

  const handleMarkerDragEnd = (e) => {
    const newPos = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    };
    setMarkerPosition(newPos);
    reverseGeocode(newPos);
  };

  const handlePlaceSelect = () => {
    const place = autocompleteRef.current.getPlace();
    if (place.geometry) {
      const newLocation = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };
      setMarkerPosition(newLocation);
      setUserLocation(newLocation);
      reverseGeocode(newLocation);
    }
  };

  const reverseGeocode = (position) => {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: position }, (results, status) => {
      if (status === 'OK' && results[0]) {
        setPlaceName(results[0].formatted_address);
      } else {
        setPlaceName("Unable to retrieve address");
      }
    });
  };

  return (
    <div>
      <button onClick={handleLocateMe} className="location-button">
        Current Location
      </button>

      {errorMessage && <div className="error-message">{errorMessage}</div>}

      {showModal && (
        <Modal
          onEnableLocation={enableLocationAccess}
          onSearchManually={searchManually}
          onClose={() => setShowModal(false)}
        />
      )}

      {showSaveAddressModal && (
        <SaveAddressModal
          onClose={() => setShowSaveAddressModal(false)}
          onSaveAddress={handleSaveAddress}
          placeName={placeName}
          userLocation={userLocation}
        />
      )}

      <LoadScript
        googleMapsApiKey="AIzaSyAsCDbpb_hzXaH31tnf0aN1r-7_UxGF4bk"
        libraries={['places']}
      >
        <div className="search-box-container">
          <Autocomplete
            onLoad={(autocomplete) => autocompleteRef.current = autocomplete}
            onPlaceChanged={handlePlaceSelect}
          >
            <input
              type="text"
              className="search-box"
              placeholder="Search for a place"
            />
          </Autocomplete>
        </div>

        <GoogleMap
          className="map-container"
          mapContainerStyle={containerStyle}
          center={userLocation}
          zoom={15}
          onLoad={() => console.log("loaded")}
        >
          <Marker
            position={markerPosition}
            draggable={true}
            onDragEnd={handleMarkerDragEnd}
          />
        </GoogleMap>
      </LoadScript>

      <div className="marker-location-info">
        <p>Place: {placeName || "Searching..."}</p>
      </div>

      <button className="location-button" onClick={handleAddress}>
        Save Address
      </button>
      <button className="location-button-cancel" onClick={handleCancel}>
        Cancel
      </button>
    </div>
  );
};

export default Maps;
