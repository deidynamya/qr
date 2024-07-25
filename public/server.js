const express = require('express');
const bodyParser = require('body-parser');

const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

let filterAssignments = {};  // { qrCode: filter }
let userStats = {};  // { userId: photoCount } // To track user photo counts

// Set filter for QR code
app.post('/api/set-filter', (req, res) => {
    const { qrCode, filter } = req.body;
    const existingIndex = filterAssignments.findIndex(a => a.qrCode === qrCode);
    if (existingIndex !== -1) {
        filterAssignments[existingIndex].filter = filter;
    } else {
        filterAssignments.push({ qrCode, filter });
    }
    res.json({ success: true });
});

// Get filter for QR code
app.get('/api/get-filter/:qrCode', (req, res) => {
    const qrCode = req.params.qrCode;
    const assignment = filterAssignments.find(a => a.qrCode === qrCode);
    if (assignment) {
        res.json({ filter: assignment.filter });
    } else {
        res.json({ filter: null });
    }
});

app.get('/api/get-filter-assignments', (req, res) => {
    res.json({ assignments: filterAssignments });
});

// Record photo capture
app.post('/api/record-photo', (req, res) => {
    const { userId } = req.body;
    if (userId) {
        if (!userStats[userId]) {
            userStats[userId] = 0;
        }
        userStats[userId]++;
        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
});

// Get filter assignments
app.get('/api/get-filter-assignments', (req, res) => {
    res.json({ assignments: Object.entries(filterAssignments).map(([qrCode, filter]) => ({ qrCode, filter })) });
});

// Get user photo counts
app.get('/api/get-user-stats', (req, res) => {
    res.json({ userStats });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});