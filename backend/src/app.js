const express = require('express');
const cookieParser = require('cookie-parser')
const authRoutes = require('./routes/auth.routes')
const foodRoutes = require('./routes/food.routes')
const foodPartnerRoutes = require('./routes/food-partner.routes')
const cors = require('cors');

// Allowed origins: deployed frontend + local dev servers
const ALLOWED_ORIGINS = [
    'https://bite-reel-frontend.onrender.com', // production
    'http://localhost:5173',                    // Vite default
    'http://localhost:3000',                    // CRA / alternate
    'http://localhost:4173',                    // Vite preview
];

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (e.g. Postman, mobile apps, server-to-server)
        if (!origin) return callback(null, true);
        if (ALLOWED_ORIGINS.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error(`CORS blocked: origin ${origin} not allowed`));
        }
    },
    credentials: true,
}))

app.use('/api/auth', authRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/food-partner', foodPartnerRoutes);

app.get('/',(req, res)=>{
    res.send("Hello world");
})

module.exports = app;