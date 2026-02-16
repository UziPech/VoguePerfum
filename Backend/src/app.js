const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: [
        'http://localhost:5173',  // Local development
        'https://vogueperfum-frontend.vercel.app',  // Old Production 
        'https://vogueperfum.vercel.app', // New Production Domain
        'https://www.vogueperfum.vercel.app', // New Production Domain (www)
        'https://vogueperfum-frontend-i205laut1-uziels-projects-fa4bbf7c.vercel.app'  // Vercel preview URLs
    ],
    credentials: true
}));
app.use(express.json());

const apiRoutes = require('./routes/api');

// Routes
app.use('/api', apiRoutes);

app.get('/', (req, res) => {
    res.send('API VoguePerfum Running');
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
