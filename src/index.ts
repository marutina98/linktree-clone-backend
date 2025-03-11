
// Environment Variables

const PORT = process.env.PORT;

// Imports

import errorHandlerMiddleware from './middlewares/error-handler.middleware';

// Import Routes

import userRoutes from './routes/user.routes';
import linkRoutes from './routes/link.routes';
import authenticationRoutes from './routes/authentication.routes';

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
app.use('/api/authentication', authenticationRoutes);

// Start Server

app.listen(PORT, () => console.log(`Server running on port ${PORT}.`));