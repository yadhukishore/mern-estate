import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
import userAuthRouter from './routes/userAuth.route.js';
import cookieParser from 'cookie-parser';
dotenv.config();

mongoose.connect(process.env.MONGOURL).then(()=>{
    console.log("Connected to MongoDB")
}).catch((err)=>{
    console.log("Error In Mongo Connect: ",err);
})
const app = express();
app.use(express.json());
app.use(cookieParser());
app.listen(4000,()=>{
    console.log(`Server is running on 4000`);
});

app.use('/api/user',userRouter);
app.use('/api/auth',userAuthRouter);

app.use((err,req,res,next)=>{
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({
        sucess:false,
        statusCode,
        message,
    })
});