import express from 'express';
import cookieParser from 'cookie-parser'; 
import cors from 'cors';
import {config} from 'dotenv';
import fileUpload from 'express-fileupload';
import { dbConnection } from './database/db.js';
import userRouter from './routes/user.routes.js';

const app = express();

//Configuring dotenv
config({
    path: './config/config.env'
}); 

//Configuring cors
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));


//Middlewares
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(fileUpload({
    useTempFiles: true, 
    tempFileDir: './temp/'
}));

app.use('/api/v1/user', userRouter);

dbConnection();

export default app;