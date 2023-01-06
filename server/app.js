
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import cookieSession from 'cookie-session';
import passport from 'passport';
import authRouter from './routes/auth';
import logger from 'morgan';
import { ExpressDataApplication, serviceRouter, dateReviver } from '@themost/express';
import indexRouter from './routes/index';
import usersRouter from './routes/users';
import '@themost/json/register';
/**
 * @name Request#context
 * @description Gets an instance of ExpressDataContext class which is going to be used for data operations
 * @type {ExpressDataContext}
 */
/**
 * @name express.Request#context
 * @description Gets an instance of ExpressDataContext class which is going to be used for data operations
 * @type {ExpressDataContext}
 */

/**
 * Initialize express application
 * @type {Express}
 */
let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));

app.use(express.json({
  reviver: dateReviver
}));
app.use(express.urlencoded({ extended: false }));

// @themost/data data application setup
const dataApplication = new ExpressDataApplication(path.resolve(__dirname, 'config'));
// hold data application
app.set('ExpressDataApplication', dataApplication);
// use cookie parser
const secret = dataApplication.getConfiguration().getSourceAt('settings/crypto/key');
// use cookie parser
app.use(cookieParser(secret));

// use session
app.use(cookieSession({
  name: 'session',
  keys: [secret]
}));
// use data middleware (register req.context)
app.use(dataApplication.middleware());
// use passport
app.use(authRouter(passport));
// use static content
app.use(express.static(path.join(process.cwd(), 'public')));

app.use('/', indexRouter);

app.use('/users', usersRouter);
// use @themost/express service router
app.use('/api', serviceRouter);

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || err.statusCode || 500);
  res.render('error');
});

module.exports = app;
