
// import 'dotenv/config';
import {config} from 'dotenv';
config();
import './common/db/db.js';
import express from 'express';
import authRouter from './app/auth/auth.routes.js';
import userRouter from './app/user/user.routes.js';
import messageRouter from './app/message/message.routes.js';

const app = express();

app.use(express.json());

app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/messages', messageRouter);

app.use((error, req, res, next)=>{
  if(error.isOperational){
   return res.status(error.statusCode).json({ message: error.message, success: false })
  }

  return res.status(500).json({ message: 'Internal Server Error', success: false })

})

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
