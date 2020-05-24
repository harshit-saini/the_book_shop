const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require("body-parser")
const connectMongoDBSession = require("connect-mongodb-session")(session);
const helmet = require('helmet');
const compression = require("compression");

if(process.env.NODE_ENV != 'production') require("dotenv").config();

const https = require("https");
const fs = require("fs");

const store = new connectMongoDBSession({
  uri : process.env.MONGODB_URI,
  collection : 'sessions'
})

 
const app = express();

// Passport Config
require('./config/passport')(passport);



// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI,{ 
    useNewUrlParser: true,
    useUnifiedTopology: true 
  })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));


const serverkey = fs.readFileSync("server.key")
const servercert = fs.readFileSync("server.cert")

app.use(helmet());
app.use(compression());

// EJS
app.use(expressLayouts);
app.set('layout', 'layouts/layout');
app.set('view engine', 'ejs');

// Express body parser
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

// static files
app.use(express.static('public'))

// Express session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store
  })
);

// Passport middlewarez
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});


// Routes
app.use('/', require('./routes/index.js'));
app.use('/users', require('./routes/users.js'));
app.use('/admin', require("./routes/admin.js"));
app.use((req, res, next) => {
  res.render("error/404",{
    title : "404"
  })
})

 

const PORT = process.env.PORT || 5000;

// https
// .createServer({key:serverkey, cert:servercert},app) 
// .listen(PORT, console.log(`Server started on port ${PORT}`));

app.listen(PORT, console.log(`server started on port : ${PORT}`));
