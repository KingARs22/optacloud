const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema({
    userid: { type: String, required: true },
    placeName: { type: String, required: true },  // Fixed the typo (palceName -> placeName)
        userLocation: {
            lat: { type: Number, required: true },  // Store latitude as a number
            lng: { type: Number, required: true }   // Store longitude as a number
        }, 
    address : {
        addrName: {type: String},
        houseNumber: {type: String},
        streetName: {type:String},
        landmark: {type: String}
    },
    isFavourite: { 
        type: Boolean, 
        default: false 
    },
    isCurrent: { 
        type: Boolean, 
        default: false 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('Address', AddressSchema);
