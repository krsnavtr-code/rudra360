import 'dotenv/config.js';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

// Import routes
import authRoutes from './routes/auth.route.js';
import mediaRoutes from './routes/media.routes.js';
import uploadRoutes from './routes/upload.route.js';
import adminRoutes from './routes/admin.routes.js';
import ownerInfoRoutes from './routes/ownerInfo.routes.js';

const app = express();

// Middleware
app.use(express.json());

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

// ES Module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define Paths
const publicDir = path.join(__dirname, "public");
const uploadsDir = path.join(__dirname, "public", "uploads");
const candidateProfileDir = path.join(publicDir, "candidate_profile");

// CORS Configuration
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://funwithjuli.in",
    "https://www.funwithjuli.in"
];

// CORS middleware
app.use((req, res, next) => {
    const origin = req.headers.origin;
    const requestMethod = req.method;

    // In development, allow all origins for easier development
    if (process.env.NODE_ENV !== 'production') {
        res.setHeader('Access-Control-Allow-Origin', origin || '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-auth-token');
        res.setHeader('Access-Control-Allow-Credentials', 'true');

        // Handle preflight requests
        if (requestMethod === 'OPTIONS') {
            return res.status(200).end();
        }
    }
    // In production, only allow specific origins
    else if (origin && allowedOrigins.some(allowedOrigin => origin === allowedOrigin || origin.startsWith(allowedOrigin))) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-auth-token');
        res.setHeader('Access-Control-Allow-Credentials', 'true');

        // Handle preflight requests
        if (requestMethod === 'OPTIONS') {
            return res.status(200).end();
        }
    }

    // Common CORS headers
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, x-auth-token, x-user-agent, x-client-ip');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    next();
});

// --- File System & Static Files ---

// Ensure directories exist
[uploadsDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`Created directory: ${dir}`);
    }
});

// List public files (Debug logs)
// try {
//     fs.readdirSync(publicDir);
//     fs.readdirSync(uploadsDir);
// } catch (e) { console.error("Error listing files", e); }

// Static Route: Uploads (with specific MIME types)
app.use("/uploads", (req, res, next) => {
    // console.log('Request for upload file:', req.path);
    next();
}, express.static(uploadsDir, {
    setHeaders: (res, filePath) => {
        const ext = path.extname(filePath).toLowerCase().substring(1);
        const mimeTypes = { jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", gif: "image/gif", webp: "image/webp" };
        if (mimeTypes[ext]) {
            res.set("Content-Type", mimeTypes[ext]);
            res.set("Cache-Control", "public, max-age=31536000");
        }
    },
}));

// Fallback Static Route (General public folder)
app.use(express.static(publicDir, {
    setHeaders: (res, path) => {
        res.setHeader("Cache-Control", "public, max-age=31536000");
    },
}));

// Test Endpoint for uploads
app.get("/test-upload/:filename", (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(uploadsDir, filename);
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(404).json({ success: false, message: "File not found", path: filePath });
    }
});

// --- Database Connection ---
const PORT = process.env.PORT || 4002;
const URI = process.env.MONGO_URI;

mongoose
    .connect(URI)
    .then(() => console.log("✅ Successfully connected to MongoDB"))
    .catch((err) => {
        console.error("❌ MongoDB connection error:", err);
        if (err.name === "MongoServerError") console.error("MongoDB Server Error:", err.message);
        process.exit(1);
    });

// --- API Routes ---

// Health & Debug
app.get("ping", (req, res) => {
    res.json({
        success: true,
        message: "Server is running",
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || "development",
    });
});

app.get("health", (req, res) => res.status(200).json({ status: "OK", timestamp: new Date() }));

// Routes
app.use('/auth', authRoutes);
app.use("/media", mediaRoutes);
app.use("/upload", uploadRoutes);
app.use("/admin", adminRoutes);
app.use('/owner-info', ownerInfoRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});