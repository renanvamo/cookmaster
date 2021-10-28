const express = require('express');
const app = require('./app');
// const path = require('path');
// const multer = require('multer');
const userRoutes = require('./routes/users');
const loginRouter = require('./routes/login');
const getErrors = require('./middlewares/errors');

// const UPLOAD_PATH = path.join(__dirname, '..', 'uploads');

app.use(express.json());
// app.use(express.static(UPLOAD_PATH));

// const storage = multer.diskStorage({
//   destination: (req, file, callback) => {
//     callback(null, UPLOAD_PATH);
//   },
//   filename: (req, file, callback) => {
//     callback(null, `${Date.now()}-${file.originalname}`);
//   },
// });

// const upload = multer({ storage });
app.use('/users', userRoutes);
app.use('/login', loginRouter);

app.use(getErrors);

const { PORT = 3000 } = process.env;

app.listen(PORT, () => console.log(`conectado na porta ${PORT}`));
