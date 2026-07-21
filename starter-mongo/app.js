const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

// Express 5 defaults the query parser to 'simple' (which parses rating[gte]=1 as a literal string key).
// We set it to 'extended' (uses the 'qs' library) to parse nested query parameters as in Express 4.
app.set('query parser', 'extended');

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// express.json() incoming JSON request body ko parse karta hai taaki req.body use kar sakein
app.use(express.json());

// app.get('/',(req,res)=>{
//     res.status(200).json({status:'success',message:'hello from the server'})
// })

app.use('/api/v1/tours', tourRouter);

app.all('/{*splat}', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
