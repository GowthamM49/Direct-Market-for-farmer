// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
    credentials: true
}));
app.use(express.json());

// MongoDB Connection
const mongoURI = "mongodb://127.0.0.1:27017/farmerDB";

// Connect to MongoDB with better error handling
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log("MongoDB Connected Successfully");
})
.catch(err => {
    console.error("MongoDB Connection Error:", err);
    process.exit(1);
});

// Add MongoDB connection error handlers
mongoose.connection.on('error', err => {
    console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
});

// =================== Schemas & Models ===================
const farmerSchema = new mongoose.Schema({
    name: String,
    phone: { type: String, unique: true },
    city: String
});

const customerSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    mobile: String,
    city: String,
    address: String
});

const itemSchema = new mongoose.Schema({
    name: String,
    price: Number,
    quantity: Number,
    farmerMobile: String,
    farmerName: String,
    farmerCity: String
});

const purchaseSchema = new mongoose.Schema({
    itemId: String,
    itemName: String,
    quantity: Number,
    price: Number,
    customerName: String,
    customerCity: String,
    customerMobile: String,
    purchaseDate: {
        type: Date,
        default: Date.now
    },
    farmerMobile: String
});

const Farmer = mongoose.model('Farmer', farmerSchema);
const Customer = mongoose.model('Customer', customerSchema);
const Item = mongoose.model('Item', itemSchema);
const Purchase = mongoose.model('Purchase', purchaseSchema);

// =================== Farmer Routes ===================
app.post('/api/farmers/register', async (req, res) => {
    try {
        const { name, phone, city } = req.body;
        const existingFarmer = await Farmer.findOne({ phone });
        if (existingFarmer) {
            return res.status(400).json({ message: 'Phone number already registered!' });
        }
        const newFarmer = new Farmer({ name, phone, city });
        await newFarmer.save();
        res.json({ message: 'Registration Successful!' });
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});

app.post('/api/farmers/login', async (req, res) => {
    const { phone } = req.body;
    try {
        const farmer = await Farmer.findOne({ phone });
        if (!farmer) {
            return res.status(404).json({ message: 'Farmer not found.' });
        }
        res.status(200).json({
            message: 'Login successful.',
            farmer: {
                name: farmer.name,
                mobile: farmer.phone,
                city: farmer.city
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error.' });
    }
});

// =================== Customer Routes ===================
app.post('/api/customers/register', async (req, res) => {
    try {
        const { 
            name, 
            email, 
            password, 
            mobile, 
            city,
            address 
        } = req.body;

        // Check if customer already exists
        const existingCustomer = await Customer.findOne({ email });
        if (existingCustomer) {
            return res.status(400).json({ message: "Email already registered!" });
        }

        // Hash password before storing
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save new customer
        const newCustomer = new Customer({
            name,
            email,
            password: hashedPassword,
            mobile,
            city,
            address: address || ''
        });
        await newCustomer.save();

        res.status(201).json({ 
            success: true,
            message: "Registration Successful!" 
        });
    } catch (err) {
        console.error("Registration Error:", err);
        res.status(500).json({ 
            success: false,
            message: "Server Error", 
            error: err.message 
        });
    }
});

app.post('/api/customers/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const customer = await Customer.findOne({ email });
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found.' });
        }
        const isMatch = await bcrypt.compare(password, customer.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }
        res.status(200).json({
            message: 'Login successful.',
            customer: {
                name: customer.name,
                mobile: customer.mobile,
                city: customer.city,
                address: customer.address
            }
        });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: 'Server error.' });
    }
});

app.get('/customers/:mobile', async (req, res) => {
    const { mobile } = req.params;
    try {
        const customer = await Customer.findOne({ mobile: mobile.trim() });
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        // Don't send password in response
        const { password, ...customerData } = customer.toObject();
        res.json(customerData);
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});

// =================== Item Routes ===================
app.get('/api/items', async (req, res) => {
    const farmerMobile = req.query.farmerMobile;
    try {
        const items = farmerMobile 
            ? await Item.find({ farmerMobile }) 
            : await Item.find();
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch items' });
    }
});

app.post('/api/items', async (req, res) => {
    const { name, price, quantity, farmerMobile, farmerName, farmerCity } = req.body;
    try {
        const newItem = new Item({ name, price, quantity, farmerMobile, farmerName, farmerCity });
        await newItem.save();
        res.status(201).json({ message: 'Item added successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to add item' });
    }
});

app.put('/api/items/:id', async (req, res) => {
    const { id } = req.params;
    const { name, price, quantity } = req.body;
    try {
        const updatedItem = await Item.findByIdAndUpdate(
            id,
            { name, price, quantity },
            { new: true }
        );
        if (!updatedItem) return res.status(404).json({ message: 'Item not found.' });
        res.status(200).json({ message: 'Item updated successfully.', item: updatedItem });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update item.' });
    }
});

app.delete('/api/items/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedItem = await Item.findByIdAndDelete(id);
        if (!deletedItem) return res.status(404).json({ message: 'Item not found.' });
        res.status(200).json({ message: 'Item deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete item.' });
    }
});

// =================== Purchase Routes ===================
app.get('/api/purchases', async (req, res) => {
    const { farmerMobile } = req.query;
    try {
        const purchases = await Purchase.find({ farmerMobile }).sort({ purchaseDate: -1 });
        res.json(purchases);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch purchases.' });
    }
});

app.post('/api/purchases', async (req, res) => {
    const { itemId, itemName, price, quantity, customerName, customerMobile, customerCity, farmerMobile } = req.body;
    try {
        const item = await Item.findById(itemId);
        if (!item || item.quantity < quantity) {
            return res.status(400).json({ message: 'Insufficient stock or item not found.' });
        }
        item.quantity -= quantity;
        await item.save();

        const purchase = new Purchase({
            itemId,
            itemName,
            price,
            quantity,
            customerName,
            customerMobile,
            customerCity,
            farmerMobile,
            purchaseDate: new Date()
        });
        await purchase.save();

        res.status(200).json({ message: 'Purchase successful.' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error.' });
    }
});

app.get("/farmers/:mobile", async (req, res) => {
    const { mobile } = req.params;
    try {
        const farmer = await Farmer.findOne({ phone: mobile.trim() });
        if (!farmer) {
            return res.status(404).json({ message: "Farmer not found" });
        }
        res.json(farmer);
    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message });
    }
});

// Add this temporary test route to your backend
app.get("/api/test-db", async (req, res) => {
    try {
        await mongoose.connection.db.admin().ping();
        res.json({ message: "Database connected successfully" });
    } catch (error) {
        res.status(500).json({ message: "Database connection failed", error: error.message });
    }
});

// Add this route to your Express app
app.get("/api/test-database", async (req, res) => {
    try {
        // Test Customer collection
        const customerCount = await Customer.countDocuments();
        
        // Test Farmer collection
        const farmerCount = await Farmer.countDocuments();
        
        // Test Item collection
        const itemCount = await Item.countDocuments();
        
        res.json({
            status: "success",
            message: "Database is working properly",
            collections: {
                customers: customerCount,
                farmers: farmerCount,
                items: itemCount
            },
            dbConnection: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Database test failed",
            error: error.message
        });
    }
});

// Test route to verify database operations
app.post("/api/test-data", async (req, res) => {
    try {
        // Test Customer creation
        const testCustomer = new Customer({
            name: "Test Customer",
            email: "test@example.com",
            password: await bcrypt.hash("password123", 10),
            mobile: "1234567890",
            city: "Test City"
        });
        await testCustomer.save();

        // Test Farmer creation
        const testFarmer = new Farmer({
            name: "Test Farmer",
            phone: "9876543210",
            city: "Test Farmer City"
        });
        await testFarmer.save();

        // Test Item creation
        const testItem = new Item({
            name: "Test Item",
            price: 100,
            quantity: 10,
            farmerMobile: "9876543210"
        });
        await testItem.save();

        res.json({
            status: "success",
            message: "Test data created successfully",
            data: {
                customer: testCustomer,
                farmer: testFarmer,
                item: testItem
            }
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Failed to create test data",
            error: error.message
        });
    }
});

// Route to check database status
app.get("/api/db-status", async (req, res) => {
    try {
        const stats = {
            customers: await Customer.countDocuments(),
            farmers: await Farmer.countDocuments(),
            items: await Item.countDocuments()
        };
        
        res.json({
            status: "success",
            message: "Database is connected",
            connectionState: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
            collections: stats
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Failed to get database status",
            error: error.message
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});