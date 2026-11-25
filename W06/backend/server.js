const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const postsRouter = require('./routes/posts');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api/posts', postsRouter);

const frontendPath = path.join(__dirname, '../frontend/dist');

app.use(express.static(frontendPath));

app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'Route not found' });
  }

  res.sendFile(path.join(frontendPath, 'index.html'));
});

app.use((error, req, res, next) => {
  console.error(error.stack);
  res.status(500).json({ error: 'Server error' });
});

async function startServer() {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is missing');
  }

  await mongoose.connect(process.env.MONGODB_URI, {
    dbName: 'blog'
  });

  console.log('Connected to MongoDB');

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer().catch(error => {
  console.error('Startup failed:', error.message);
  process.exit(1);
});