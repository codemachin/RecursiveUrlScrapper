const path = require('path')

const express = require('express')
const cors = require('cors');
const logger = require('morgan');

require('./db/initialize-db');
const { recursiveCrawl } = require('./controllers/recursiveCrawl')


let port = process.env.PORT || 8080;
let app = express();

// use all middlewares
app.use(
    logger('dev'),
    cors()
);

// all api routes here. Didnot use router as has only 2 apis.
recursiveCrawl(app);

app.listen(port,console.info("Server running, listening on port ", port));