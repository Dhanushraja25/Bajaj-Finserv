const express = require('express');
const app = express();
const cors = require('cors');

// Middleware to parse JSON requests
app.use(express.json());
app.use(cors());

// POST /bfhl endpoint
app.post('/bfhl', (req, res) => {
    const { full_name, dob, email, roll_number, data } = req.body;

    // Check if required fields are provided
    if (!full_name || !dob || !email || !roll_number || !Array.isArray(data)) {
        return res.status(400).json({
            is_success: false,
            message: 'Missing or invalid fields in request'
        });
    }

    // Extract numbers and alphabets from data array
    const alphabets = data.filter(item => /^[a-zA-Z]+$/.test(item));
    const numbers = data.filter(item => /^[0-9]+$/.test(item));

    // Find the highest alphabet
    const highestAlphabet = alphabets.length > 0 ? [Math.max(...alphabets.map(char => char.charCodeAt(0)))] : [];

    // Convert the highest alphabet Unicode value back to a character
    const highestAlphabetChar = highestAlphabet.length > 0 ? String.fromCharCode(...highestAlphabet) : '';

    // Generate user_id in format "first_last_ddmmyyyy"
    const user_id = `${full_name.split(' ').join('_').toLowerCase()}_${dob.replace(/-/g, '')}`;

    // Respond with the required fields
    res.status(200).json({
        is_success: true,
        user_id,
        email,
        roll_number,
        numbers,
        alphabets,
        highest_alphabet: highestAlphabetChar ? [highestAlphabetChar] : []
    });
});

// GET /bfhl endpoint
app.get('/bfhl', (req, res) => {
    res.status(200).json({
        operation_code: 1
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
