const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cors = require('cors');
const PORT = 5000
const Usermodel = require('./models/users')
const Addressmodel = require('./models/address')
const app = express()
app.use(express.json())
app.use(cors())
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
app.get('/', (req, res) => {
    res.send('Welcome to the API');
  });
mongoose.connect("mongodb+srv://akshatrangari2004:tVoLw9AcJn5fsw1P@cluster0.rln8s.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
.then(()=>console.log('Connected to MongoDB'))
.catch(err => console.error('Error:',err))

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await Usermodel.findOne({ email: email });

        if (user) {
            // Use await here for bcrypt comparison
            const isMatch = await bcrypt.compare(password, user.password);
            
            if (isMatch) {
                res.json({
                    message: "Success",
                    userId: user._id
                });
            } else {
                res.json("Password is incorrect");
            }
        } else {
            res.json("No user registered with this email");
        }
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Error logging in' });
    }
});

app.post('/signup',(req,res)=>{
    Usermodel.create(req.body)
    .then(users => res.json(users))
    .catch(err => res.json(err))
})

app.get('/user/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await Usermodel.findById(userId); 
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  

      res.json({ name: user.name });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  });
  

app.post('/newaddress', (req, res) => {
    const { userId,placeName, userLocation,address } = req.body;


    if (!userLocation || typeof userLocation.lat !== 'number' || typeof userLocation.lng !== 'number') {
        return res.status(400).json({ error: 'Invalid location data' });
    }
    const newAddr = new Addressmodel({
        userid: userId,placeName,userLocation,address,isFavourite:  false,isCurrent:false
    })
        newAddr.save()
        .then(addr => res.json(addr))
        .catch(err => res.status(500).json({ error: err.message }));
});


app.get('/addresses/:userid', (req, res) => {
    const { userid } = req.params;
    Addressmodel.find({ userid })
        .then(addresses => res.json(addresses))
        .catch(err => res.status(500).json({ error: err.message }));
});


app.patch('/addresses/favourite/:id', (req, res) => {
    const { id } = req.params;
    Addressmodel.findByIdAndUpdate(id, { isFavourite: true })
        .then(() => res.json({ message: 'Address marked as favourite' }))
        .catch(err => res.status(500).json({ error: err.message }));
});


app.patch('/addresses/current/:id', (req, res) => {
    const { id } = req.params;
    const { userId } = req.body;

    Addressmodel.updateMany({ userid: userId }, { isCurrent: false }) 
        .then(() => {
            Addressmodel.findByIdAndUpdate(id, { isCurrent: true }) 
                .then(() => res.json({ message: 'Address set as current' }))
                .catch(err => res.status(500).json({ error: err.message }));
        })
        .catch(err => res.status(500).json({ error: err.message }));
});

app.delete('/addresses/:id', (req, res) => {
    const { id } = req.params;

    Addressmodel.findByIdAndDelete(id)
        .then(() => res.json({ message: 'Address deleted successfully' }))
        .catch(err => res.status(500).json({ error: err.message }));
});
