require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
//const multer = require('multer');
const path = require('path');
const { User } = require('./models/User');
const { Update } = require('./models/Update');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const villageRoutes = require('./routes/village');
const updateRoute = require('./routes/Update');
const usersRoutes = require('./routes/users');
const Village = require('./models/Village');

const app = express();

// Configure Multer
/*
const uploadPath = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}
    

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, `village-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});
*/
// Single CORS configuration
// Replace the current CORS configuration with:
// Replace your current CORS middleware with:
const corsOptions = {
    origin: ['http://localhost:8082'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 204
};

app.use(cors(corsOptions));


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files with CORS headers
//app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use((req, res, next) => {
  res.set('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
});
app.use('/frontend/assets', express.static(path.join(__dirname, '../frontend/assets')));

// Routes
app.use('/api/villages', villageRoutes);
app.use('/api/updates', updateRoute);
app.use('/api/users', usersRoutes);

//const upload = multer({ storage });

app.post("/api/signup", async (req, res) => {
    try {
        const { name, email, password, confirmPassword, role } = req.body;

        if (!name || !email || !password || !confirmPassword || !role) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role,
        });

        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

app.post('/api/submitUpdate', async (req, res) => {
    try {
        const { firstName, lastName, villageName, updateType, description, imageUrls } = req.body;

        const newUpdate = new Update({
            firstName,
            lastName,
            villageName,
            updateType,
            description,
            images: imageUrls, // Now expects an array of URLs
        });
        
        await newUpdate.save();
        res.status(201).json({ message: 'Update submitted successfully!', update: newUpdate });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

app.get('/api/test-user', async (req, res) => {
    try {
        await addTestUser();
        res.status(200).send('Test user added successfully!');
    } catch (error) {
        res.status(500).send('Error adding test user.');
    }
});

app.get('/api/villages/:id', async (req, res) => {
    try {
      const village = await Village.findById(req.params.id);
      if (!village) {
        return res.status(404).json({ message: 'Village not found' });
      }
      res.json(village);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
});

app.post('/api/addVillage', async (req, res) => {
    try {
        const { name, description, imageUrl } = req.body;
        
        // Add validation
        if (!name || !description) {
            return res.status(400).json({ error: "Name and description are required" });
        }

        const newVillage = new Village({
            name,
            description,
            image: imageUrl || 'https://via.placeholder.com/300x200?text=No+Image',
            location: {
                type: 'Point',
                coordinates: [0, 0]
            }
        });
  
        await newVillage.save();
        res.status(201).json(newVillage);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ 
            error: "Failed to save village",
            details: error.message 
        });
    }
});


app.get('/api/villages', async (req, res) => {
  try {
    const villages = await Village.find();
    res.status(200).json(villages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching villages', error: error.message });
  }
});

mongoose.connect(process.env.DB)
    .then(() => { console.log('MongoDB connected successfully'); })
    .catch((err) => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 8081;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});