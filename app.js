const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const authRoute = require('./routes/authRoute');
const globalErrorController = require('./controllers/errorController');
const { protect } = require('./controllers/authController');
const AppError = require('./utils/AppError');

const app = express();

app.use(
  cors({
    credentials: true,
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    origin: ['http://localhost:5173', '*'],
  })
);
app.use(express.json());
app.use(morgan('dev'));

// Initial screen of API
app.get('/', (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.sendFile(__dirname + '/public/index.html');
});

app.use('/api/v1/auth', authRoute);

app.all('*', (req, res, next) => {
  next(new AppError(`can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorController);

module.exports = app;
