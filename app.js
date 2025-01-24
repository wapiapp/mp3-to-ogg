const express = require('express');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const { Buffer } = require('buffer');

ffmpeg.setFfmpegPath(ffmpegPath);

const app = express();
const port = 3000;

app.use(express.json({ limit: '10mb' })); // Limitar o tamanho do corpo da requisição

app.post('/convert', (req, res) => {
  const { audioBase64 } = req.body;

  if (!audioBase64) {
    return res.status(400).send('Nenhum áudio enviado.');
  }

  const inputBuffer = Buffer.from(audioBase64, 'base64');
  const outputBuffer = [];

  ffmpeg()
    .input(inputBuffer)
    .inputFormat('mp3') // Substitua pelo formato de entrada correto
    .audioCodec('libvorbis')
    .toFormat('ogg')
    .on('data', (chunk) => {
      outputBuffer.push(chunk);
    })
    .on('end', () => {
      const finalBuffer = Buffer.concat(outputBuffer);
      const outputBase64 = finalBuffer.toString('base64');
      res.json({ audioBase64: outputBase64 });
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