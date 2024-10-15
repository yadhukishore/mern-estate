import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js'
dotenv.config();

mongoose.connect(process.env.MONGOURL).then(()=>{
    console.log("Connected to MongoDB")
}).catch((err)=>{
    console.log("Error In Mongo Connect: ",err);
})
const app = express();
app.listen(4000,()=>{
    console.log(`Server is running on 4000`);
});

app.use('/api/user',userRouter)