
// Environment Variables

const PORT = process.env.PORT;

// Imports

import errorHandlerMiddleware from './middlewares/errorHandler';
import userRoutes from './routes/user.routes';

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

// Start Server

app.listen(PORT, () => console.log(`Server running on port ${PORT}.`));