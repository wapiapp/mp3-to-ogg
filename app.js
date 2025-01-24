const express = require('express');
const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const ffmpegPath = require('ffmpeg-static');
const fs = require('fs');

// Verificar se a pasta uploads existe, se não, criar
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

ffmpeg.setFfmpegPath(ffmpegPath);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir); // Usando a pasta uploads criada
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

const app = express();
const port = 3000;

app.post('/convert', upload.single('audio'), (req, res) => {
  const inputPath = req.file.path;
  const outputPath = `./uploads/${Date.now()}.ogg`;

  ffmpeg(inputPath)
    .output(outputPath)
    .audioCodec('libvorbis')
    .on('end', () => {
      res.download(outputPath, (err) => {
        if (err) {
          console.log('Erro ao enviar o arquivo:', err);
        }
        fs.unlinkSync(inputPath);
        fs.unlinkSync(outputPath);
      });
    })
    .on('error', (err) => {
      console.error('Erro na conversão:', err);
      res.status(500).send('Erro na conversão');
    })
    .run();
});

app.listen(port, () => {
  console.log(`API rodando na porta ${port}`);
});
