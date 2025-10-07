const User = require('../models/userModel');
const Role = require('../models/roleModel');
const jwt = require('jsonwebtoken'); // Import JWT library
const bcrypt = require('bcrypt');

module.exports = {
    async join(req, res) {
        try {
            const user = new User({
                email: req.body.email,
                password: req.body.password,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                mobilePhone: req.body.mobilePhone,
                areaOfInterest: req.body.areaOfInterest,
                streetName: req.body.streetName,
                city: req.body.city,
                state: req.body.state,
                postcode: req.body.postcode,
            });
    
            if (req.body.role) { // If role is provided, find and assign it 
                const role = await Role.findOne({ name: req.body.role });
                user.role = role._id;
            } else {
                const defaultRole = await Role.findOne({ name: "member" });
                user.role = defaultRole._id;
            }
            console.log("User before saving:", user);
            await user.save(); // Save the user to the database
            console.log("User saved successfully");
            return res.status(201).json({ message: "User was registered successfully." });
        } catch (error) {
            console.log("req.body:", req.body);
            console.error("Error during user registration:", error);
            return res.status(400).json({ message: 'Registration failed. Please try again.', errors: error.message });
        }
    },

    async login(req, res) {
        try {
            // Step 1: Find the user by email
            const user = await User.findOne({ email: req.body.email }).populate('role');
            if (!user) {
                return res.status(401).json({ message: 'Invalid email or password.' });
            }

            // Step 2: Compare passwords
            const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ message: 'Invalid email or password.' });
            }

            // Step 3: Generate a token
            const token = jwt.sign(
                { id: user._id },
                process.env.ACCESS_TOKEN || 'your_jwt_secret', // Use a secure secret in production
                { expiresIn: '24h' }
            );

            // Step 4: Send a response
            return res.status(200).json({
                message: 'Login successful.',
                token,
                role: user.role.name,
            });
            
        } catch (error) {
            console.error('Error during login:', error);
            return res.status(500).json({ message: 'Login failed. Please try again.', errors: error.message });
        }
    },

};