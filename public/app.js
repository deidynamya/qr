const express = require('express');
const multer = require('multer');
const path = require('path');
const qr = require('qr-image');
const fs = require('fs');
const QRCode = require('qrcode');

const app = express();
const port = 3000;

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/filters');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Serve static files
app.use(express.static('public'));

// Upload file endpoint
app.post('/upload', upload.single('filter'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).send('No file uploaded.');
    }

    const filterName = path.basename(file.filename, path.extname(file.filename));
    const qrCodePath = path.join(__dirname, `public/qr_codes/${filterName}_qr.png`);

    // QR 코드 생성
    const qrData = `http://59.29.87.113:${port}/ar.html?fileUrl=http://59.29.87.113:${port}/filters/${req.file.filename}`;
    await QRCode.toFile(qrCodePath, qrData);

    // QR 코드 생성이 완료되면 응답을 전송합니다.
    res.send(`
      <h1>File uploaded and QR code generated!</h1>
      <a href="/qr_codes/${filterName}_qr.png">Download QR Code</a><br>
      <a href="/admin">Upload another filter</a>
    `);
  } catch (error) {
    console.error('Error uploading file and generating QR code:', error);
    res.status(500).send('Error uploading file and generating QR code.');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://59.29.87.113:${port}/`);
});
