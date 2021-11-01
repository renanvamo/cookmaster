const express = require('express');
const path = require('path');
const app = require('./app');
const userRoutes = require('./routes/users');
const loginRouter = require('./routes/login');
const recipesRouter = require('./routes/recipes');
const imagesRouter = require('./routes/images');
const { getErrors } = require('./middlewares/errors');

app.use(express.json());

app.use(express.static(path.join(__dirname, '..', 'uploads')));

app.use('/users', userRoutes);
app.use('/login', loginRouter);
app.use('/recipes', recipesRouter);
app.use('/images', imagesRouter);

app.use(getErrors);

const { PORT = 3000 } = process.env;

app.listen(PORT, () => console.log(`conectado na porta ${PORT}`));

module.exports = app;
