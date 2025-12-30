const express = require('express');
const path = require('path');
const app = express();

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, '.')));

// Ruta principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'quiz.html'));
});

// Puerto desde variable de entorno o puerto por defecto
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Servidor ejecutándose en puerto ${PORT}`);
  console.log(`📍 URL: http://localhost:${PORT}`);
});
