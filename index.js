const express = require('express');
require('dotenv').config();
const path = require('path');
const bodyParser = require('body-parser');
const expressSession = require('express-session');
const passport = require('./config/passportConfig');
const db = require('./config/db')
const imgdb = require('./config/imgdb'); 
const router = require('./routes/index');
const flash = require('connect-flash');
const app = express();

const PORT = process.env.PORT || 3003;
const URL = process.env.URL || 'http://localhost:';

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); 

app.use(expressSession({ 
    secret: 'mySecretKey', 
    resave: true, 
    saveUninitialized: true 
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/upload', express.static(path.join(__dirname, 'upload')));
app.use(flash());
app.use(express.static(path.join(__dirname, 'views'))); 
app.use('/', router);

app.listen(PORT, (err) => {
    if (!err) {
        console.log(`Server is running on ${URL}${PORT}`);
    } else {
        console.log(`Error: ${err}`);
    }
});
