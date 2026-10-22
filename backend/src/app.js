
import path from 'path';
import express from 'express';
import cors from 'cors';

import { notFound, errorHandler } from './middleware/errorMiddleware.js';

import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import knowledgeRoutes from './routes/knowledgeRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import razorpayRoutes from './routes/razorpayRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/knowledge', knowledgeRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/razorpay', razorpayRoutes);

// Uploaded files now live in src/uploads.
app.use(
  '/uploads',
  express.static(path.join(process.cwd(), 'src', 'uploads'))
);

app.get('/', (req, res) => {
  res.send('API is running....');
});

// Keep error-handling middleware after the routes.
app.use(notFound);
app.use(errorHandler);

export default app;
