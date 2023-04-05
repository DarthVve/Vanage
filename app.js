const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const connectDB = require('./src/db/dbConfig');

const indexRouter = require('./src/routes/index');
const usersRouter = require('./src/routes/users');

//Connect to Database
connectDB();

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/users', usersRouter);

//GraphQL Setup
const { graphqlHTTP } = require('express-graphql');
const schema = require('./src/schema/schema');

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: process.env.NODE_ENV === 'development'
}));


module.exports = app;
