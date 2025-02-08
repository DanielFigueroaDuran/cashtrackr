import express from 'express';
import colors from 'colors';
import morgan from 'morgan';
import { db } from './config/db';
import budgetRouter from "./routes/budgetRouter";
import authRouter from "./routes/authRouter";

const connectDB = async () => {
      try {
            await db.authenticate();
            db.sync();
            console.log(colors.blue.bold('Conexíon exitosa a la BD'));
      } catch (error) {
            console.log(colors.red.bold('Fallo la Conexión a la BD'));

      }
};

connectDB();

const app = express();

app.use(morgan('dev'));

app.use(express.json());

app.use('/api/budgets', budgetRouter);
app.use('/api/auth', authRouter);

app.use('/', (req, res) => {
      res.send('Todo bien...');
});


export default app