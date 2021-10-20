const express = require('express')
const handlebars  = require('express-handlebars')
const methodOverride = require('method-override')
var mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path')
const app = express()
const port = 3000

app.use(methodOverride('_method'))

const route = require('./routes');
const db = require('./config/db');

// Connect to DB
db.connect();

//use sessions for tracking logins
app.use(session({
  // process.env.MONGODB_URI
  store: MongoStore.create({ mongoUrl: 'mongodb+srv://nguyennhathuycd:*N123456789@cluster0.wvlgp.mongodb.net/supmark?retryWrites=true&w=majority'}),
  secret: 'work hard',
  resave: true,
  saveUninitialized: false,
}));

app.use(express.static(path.join(__dirname, 'public')))

// Template engine
app.engine('hbs', handlebars({ extname: 'hbs'}))
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, 'resources', 'views'))

var hbs = handlebars.create({});

hbs.handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {
  switch (operator) {
      case '||':
          return (v1 || v2) ? options.fn(this) : options.inverse(this);
      default:
          return options.inverse(this);
  }
});

// register new function
hbs.handlebars.registerHelper('increasePrice', function(price) {
  price+=10;
  return price;
})


// parse incoming requests
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// serve static files from template
app.use(express.static(__dirname + '/public'))

  route(app)

app.listen( process.env.PORT || port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})