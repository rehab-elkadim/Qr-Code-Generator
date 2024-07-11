import express from 'express';
import bodyParser from 'body-parser';
import qr from 'qr-image';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = 3000;

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint to generate QR code
app.post('/generate-qr-code', (req, res) => {
  const url = req.body.url;
  const qr_svg = qr.image(url);
  const qrImagePath = path.join(__dirname, 'public', 'qr_img.png');

  qr_svg.pipe(fs.createWriteStream(qrImagePath))
    .on('finish', () => {
      res.send({ message: 'QR code generated', path: 'qr_img.png' });
    })
    .on('error', (err) => {
      res.status(500).send({ error: 'Failed to generate QR code' });
    });
});

// Serve the index.html file for the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
