const express = require('express')
const handlebars = require('express-handlebars')
const Handlebar = require('handlebars');
const methodOverride = require('method-override')
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const multer = require('multer');
const keys = require('./config/googleKey/key')
require('./services/passport')
const path = require('path')
const app = express()
const port = 3000

app.use(methodOverride('_method'))

const route = require('./routes');
const db = require('./config/db');

var upload = multer({ dest: './public/uploads/avatar' });

const User = require('./models/user')

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://nguyennhathuycd:*N123456789@cluster0.wvlgp.mongodb.net/supmark?retryWrites=true&w=majority";
var ObjectId = require('mongodb').ObjectId;

// Connect to DB
db.connect();

//use sessions for tracking logins
app.use(session({
  // process.env.MONGODB_URI
  store: MongoStore.create({ mongoUrl: 'mongodb+srv://nguyennhathuycd:*N123456789@cluster0.wvlgp.mongodb.net/supmark?retryWrites=true&w=majority' }),
  secret: 'work hard',
  resave: false,
  saveUninitialized: false,
  cookie: { expires: new Date(Date.now() + (86400 * 1000)) },
}));

// Initializes passport and passport sessions
app.use(passport.initialize());
app.use(passport.session());

// var hbs = handlebars.create({
//   helpers: {
//     ifEquals: function (arg1, arg2, options) {
//       return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
//     },
//     getStringifiedJson: function (value) {
//       return JSON.stringify(value);
//     }
//   },
//   defaultLayout: 'main',
//   partialsDir: ['views/partials/']
// });


Handlebar.registerHelper('ifEquals', function (arg1, arg2, options) {
  return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});

// Template engine
app.engine('hbs', handlebars({ extname: 'hbs' }));
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, 'resources', 'views'))

app.use(express.static(path.join(__dirname, './public')))

// parse incoming requests
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.post('/profile',  upload.single("avatar"), async (req, res) => {
  const { name, phone, address, birthday } = req.body;
  console.log(name, phone);


  const user = await User.findOneAndUpdate({ _id: new ObjectId(req.session._id) }, { name, phone, address, birthday }, { new: true })
  console.log("user", user);
  return res.redirect('/profile')



})

route(app)

app.listen(process.env.PORT || port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})