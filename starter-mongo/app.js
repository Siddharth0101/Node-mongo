const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// express.json() incoming JSON request body ko parse karta hai taaki req.body use kar sakein
app.use(express.json());

// app.get('/',(req,res)=>{
//     res.status(200).json({status:'success',message:'hello from the server'})
// })

app.use('/api/v1/tours', tourRouter);

module.exports = app;
