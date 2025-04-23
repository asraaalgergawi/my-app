const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');
const { Update } = require('./models/Update'); // Assuming you have a defined Update model
require('dotenv').config();
app.use("/uploads", express.static("uploads"));

const app = express();

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Connect to MongoDB
mongoose
  .connect(process.env.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.use(cors()); // Enable CORS for cross-origin requests
app.use(express.json()); // To handle JSON payloads
app.use(express.urlencoded({ extended: true })); // To handle URL encoded data
app.use('/uploads', express.static('uploads')); // Serve uploaded files

// POST endpoint to submit update data
app.post('/api/submitUpdate', upload.array('images', 10), async (req, res) => {
  try {
    // Extract form data and images from the request
    const { firstName, lastName, villageName, updateType, description } = req.body;
    const images = req.files.map((file) => `/uploads/${file.filename}`);

    // Create a new update document
    const newUpdate = new Update({
      firstName,
      lastName,
      villageName,
      updateType,
      description,
      images,
    });

    // Save the update document to the database
    await newUpdate.save();
    res.status(200).json({ message: 'Update submitted successfully', newUpdate });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error saving update', error });
  }
});
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) return res.status(404).send({ message: "User not found" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).send({ message: "Invalid password" });

    // إرجاع بيانات المستخدم بما فيها role
    res.status(200).send({
      message: "Logged in successfully",
      role: user.role,
      userId: user._id
    });
  } catch (error) {
    res.status(500).send({ message: "Server error" });
  }
});
// New route to test adding a user
app.get('/api/test-user', async (req, res) => {
  try {
      await addTestUser();
      res.status(200).send('Test user added successfully!');
  } catch (error) {
      res.status(500).send('Error adding test user.');
  }
});
// Start the server
const PORT = process.env.PORT || 8082;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
