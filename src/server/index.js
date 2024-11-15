import express from 'express';
import cors from 'cors';
import apiRouter from './api.js';
import './db/setup.js';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());
app.use('/api', apiRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});