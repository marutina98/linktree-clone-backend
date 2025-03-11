
// Environment Variables

const PORT = process.env.PORT;

// Imports

import errorHandlerMiddleware from './middlewares/errorHandler';

// Import Routes

import userRoutes from './routes/user.routes';
import linkRoutes from './routes/link.routes';

// Express

import express from 'express';
const app = express();

// Express Middlewares: Body Parsing

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Express Middlewares: Other

app.use(errorHandlerMiddleware);

// Express Routes

app.use('/api/users', userRoutes);
app.use('/api/links', linkRoutes);

// Start Server

app.listen(PORT, () => console.log(`Server running on port ${PORT}.`));