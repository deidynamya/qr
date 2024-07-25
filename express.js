             // server.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const QRCode = require('qrcode');
const fs = require('fs');
const app = express();
const port = 3000;

// 새로운 URL
const baseURL = 'https://deidynamya.github.io/qr'; // 원하는 URL로 변경하세요

// Multer 설정
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, 'public/filters'));
    },
    filename: function (req, file, cb) {
        cb(null, path.basename(file.originalname, path.extname(file.originalname)) + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Serve static files
app.use(express.static('public'));

// 정적 파일 제공
app.use('/filters', express.static(path.join(__dirname, 'public/filters')));
app.use('/qr_codes', express.static(path.join(__dirname, 'public/qr_codes')));
app.use(express.static(path.join(__dirname, 'public')));

// 업로드 페이지 제공
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/admin.html'));
});

// 사용자 페이지 제공
app.get('/user', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/user.html'));
});

// 파일 업로드 및 QR 코드 생성 라우트
app.post('/upload', upload.single('filter'), async (req, res) => {
  try {
      const file = req.file;
      if (!file) {
          return res.status(400).send('No file uploaded.');
      }
      
      const filterName = path.basename(file.originalname, path.extname(file.originalname));
      const qrCodePath = path.join(__dirname, `public/qr_codes/${filterName}_qr.png`);
      
      // QR 코드 생성
      const qrData = `${baseURL}/ar.html?fileUrl=${baseURL}/filters/${req.file.filename}`;
      await QRCode.toFile(qrCodePath, qrData);
      
      res.send(`
          <h1>File uploaded and QR code generated!</h1>
          <a href="/qr_codes/${filterName}_qr.png">Download QR Code</a><br>
          <a href="/admin">Upload another filter</a>
      `);
  } catch (err) {
    console.error('Error uploading file and generating QR code:', error);
    res.status(500).send('Error uploading file and generating QR code.');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// 필터 이미지를 가져오는 API
app.get('/filter/:name', (req, res) => {
    const filterName = req.params.name;
    const filterPath = path.join(__dirname, `public/filters/${filterName}.png`);
    
    if (fs.existsSync(filterPath)) {
        res.sendFile(filterPath);
    } else {
        res.status(404).send('Filter not found.');
    }
});

// 필터 페이지 제공
app.get('/user', (req, res) => {
    const filterName = req.query.filter;
    if (filterName) {
        res.sendFile(path.join(__dirname, 'public/user.html'));
    } else {
        res.status(400).send('No filter specified.');
    }
});

// 필터 이미지 제공 엔드포인트
app.get('/filter/:name', (req, res) => {
  const filterName = req.params.name;
  const filterPath = path.join(__dirname, 'public', 'filters', `${filterName}.png`);
  
  fs.access(filterPath, fs.constants.F_OK, (err) => {
      if (err) {
          res.status(404).send('Filter not found');
      } else {
          res.sendFile(filterPath);
      }
  });
});

// QR 코드 생성
app.post('/generate-qr', async (req, res) => {
  const { filterName } = req.body;
  const qrCodePath = path.join(__dirname, 'public', 'qr_codes', `${filterName}_qr.png`);
  const qrData = `myapp://filter?name=${filterName}`; // URL 스킴 사용
  await QRCode.toFile(qrCodePath, qrData);
  res.send({ qrCodePath });
});

