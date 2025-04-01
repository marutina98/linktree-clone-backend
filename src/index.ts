
// Environment Variables

const PORT = process.env.PORT;

// Imports

import errorHandlerMiddleware from './middlewares/error-handler.middleware';
import { dataSeeder } from './seeders/data.seeder';

// Import Routes

import userRoutes from './routes/user.routes';
import linkRoutes from './routes/link.routes';
import authenticationRoutes from './routes/authentication.routes';

// Express

import express from 'express';
const app = express();
import cors from 'cors';

// Express Middlewares: Body Parsing

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Express Routes

app.use('/api/users', userRoutes);
app.use('/api/links', linkRoutes);
app.use('/api/authentication', authenticationRoutes);

// Express Middlewares: Other

app.use(errorHandlerMiddleware);

// Seeding Database

// (async () => {
//   await dataSeeder.init();
// })();

// Start Server

app.listen(PORT, () => console.log(`Server running on port ${PORT}.`));

export default app;