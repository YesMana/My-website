const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3000;
const REVIEWS_FILE = path.join(__dirname, 'reviews.json');
const SETTINGS_FILE = path.join(__dirname, 'settings.json');

// Default Settings
const defaultSettings = {
    whatsappNumber: "94700000000",
    phoneNumber: "+94 7X XXX XXXX",
    email: "hello@dilshanmanujaya.com",
    facebook: "#",
    youtube: "#",
    linkedin: "#",
    instagram: "#"
};

// Setup multer for image uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, 'uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname, {
    setHeaders: (res, path) => {
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
    }
})); // Serve static files from root without cache
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve uploaded images

// Initialize files if they don't exist
if (!fs.existsSync(REVIEWS_FILE)) {
    fs.writeFileSync(REVIEWS_FILE, JSON.stringify([]));
}
if (!fs.existsSync(SETTINGS_FILE)) {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(defaultSettings, null, 2));
}

// ----------------- AUTHENTICATION -----------------
app.post('/api/login', (req, res) => {
    const { password } = req.body;
    // Simple hardcoded password for the dashboard
    if (password === 'Manu@12788520#@') {
        res.json({ success: true, token: 'fake-jwt-token-123' });
    } else {
        res.status(401).json({ success: false, error: 'Invalid password' });
    }
});

// ----------------- SETTINGS API -----------------
app.get('/api/settings', (req, res) => {
    try {
        const data = fs.readFileSync(SETTINGS_FILE, 'utf8');
        res.json(JSON.parse(data));
    } catch (err) {
        res.status(500).json({ error: 'Failed to read settings' });
    }
});

app.put('/api/settings', upload.single('logo'), (req, res) => {
    try {
        const newSettings = { ...req.body };
        if (req.file) {
            newSettings.logoUrl = `/uploads/${req.file.filename}`;
        } else {
            // Keep existing logo if not uploaded
            const oldData = fs.readFileSync(SETTINGS_FILE, 'utf8');
            const oldSettings = JSON.parse(oldData);
            if (oldSettings.logoUrl) newSettings.logoUrl = oldSettings.logoUrl;
        }
        fs.writeFileSync(SETTINGS_FILE, JSON.stringify(newSettings, null, 2));
        res.json({ success: true, settings: newSettings });
    } catch (err) {
        res.status(500).json({ error: 'Failed to save settings' });
    }
});

// ----------------- REVIEWS API -----------------
app.get('/api/reviews', (req, res) => {
    try {
        const data = fs.readFileSync(REVIEWS_FILE, 'utf8');
        res.json(JSON.parse(data));
    } catch (err) {
        res.status(500).json({ error: 'Failed to read reviews' });
    }
});

app.post('/api/reviews', upload.single('image'), (req, res) => {
    try {
        const { clientName, text, platform } = req.body;
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
        
        const newReview = {
            id: Date.now().toString(),
            clientName,
            text,
            platform: platform || 'Facebook',
            imageUrl,
            date: new Date().toISOString()
        };

        const data = fs.readFileSync(REVIEWS_FILE, 'utf8');
        const reviews = JSON.parse(data);
        reviews.unshift(newReview); 

        fs.writeFileSync(REVIEWS_FILE, JSON.stringify(reviews, null, 2));
        res.status(201).json(newReview);
    } catch (err) {
        res.status(500).json({ error: 'Failed to save review' });
    }
});

app.post('/api/reviews/bulk', upload.array('images', 50), (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'No files uploaded' });
        }

        const data = fs.readFileSync(REVIEWS_FILE, 'utf8');
        const reviews = JSON.parse(data);
        const newReviews = [];

        req.files.forEach(file => {
            const newReview = {
                id: Date.now().toString() + Math.floor(Math.random() * 1000),
                clientName: 'Client Review', 
                text: 'See attached screenshot.',
                platform: 'Social Media',
                imageUrl: `/uploads/${file.filename}`,
                date: new Date().toISOString()
            };
            newReviews.push(newReview);
            reviews.unshift(newReview);
        });

        fs.writeFileSync(REVIEWS_FILE, JSON.stringify(reviews, null, 2));
        res.status(201).json(newReviews);
    } catch (err) {
        res.status(500).json({ error: 'Failed to save bulk reviews' });
    }
});

app.put('/api/reviews/:id', (req, res) => {
    try {
        const { id } = req.params;
        const { clientName, text, platform } = req.body;
        
        const data = fs.readFileSync(REVIEWS_FILE, 'utf8');
        let reviews = JSON.parse(data);
        
        const reviewIndex = reviews.findIndex(r => r.id === id);
        if (reviewIndex !== -1) {
            reviews[reviewIndex].clientName = clientName;
            reviews[reviewIndex].text = text;
            reviews[reviewIndex].platform = platform;
            
            fs.writeFileSync(REVIEWS_FILE, JSON.stringify(reviews, null, 2));
            res.json(reviews[reviewIndex]);
        } else {
            res.status(404).json({ error: 'Review not found' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Failed to update review' });
    }
});

app.delete('/api/reviews/:id', (req, res) => {
    try {
        const { id } = req.params;
        const data = fs.readFileSync(REVIEWS_FILE, 'utf8');
        let reviews = JSON.parse(data);
        
        const reviewToDelete = reviews.find(r => r.id === id);
        if (reviewToDelete && reviewToDelete.imageUrl) {
            const imagePath = path.join(__dirname, reviewToDelete.imageUrl);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        reviews = reviews.filter(r => r.id !== id);
        fs.writeFileSync(REVIEWS_FILE, JSON.stringify(reviews, null, 2));
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete review' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
