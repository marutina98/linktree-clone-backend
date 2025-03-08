
// export {} fixes redeclaration error
// in a file without exports.

export {}

const express = require('express');
const app = express();

// Middlewares

const errorHandler = require('./middlewares/error-handler.middleware');

// Routes

const userRoutes = require('./routes/users.routes');

// Environment Variables

const PORT = process.env.PORT;

// Express Middlewares: Body Parser

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes

app.use('/api/users', userRoutes);

// Express Middleware: Error Handler

app.use(errorHandler);

// Server

app.listen(PORT, () => console.log(`Server running on port ${PORT}.`));