import express from 'express';
import cors from 'cors';
import diasRoutes from './routes/dias.routes.js';

const app = express();

app.use(cors());
app.use(express.json());


app.use('/api/dias', diasRoutes);


export default app;
