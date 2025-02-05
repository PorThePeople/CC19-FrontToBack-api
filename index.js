const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const authRouter = require('./routes/auth-route');
const handleErrors = require('./middlewares/error');

const app = express();

// Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api', authRouter);

app.use(handleErrors);

//
const PORT = 8000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
