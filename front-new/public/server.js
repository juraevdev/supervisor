const express = require('express');
const path = require('path');

const app = express();

// static fayllar
app.use(express.static(path.join(__dirname, 'build')));

// Barcha boshqa route'lar uchun index.html qaytariladi
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server ${port}-portda ishga tushdi`);
});
