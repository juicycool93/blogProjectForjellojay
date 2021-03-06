//require('throw-max-listeners-error');
var express = require('express');
var app = express();
var path = require('path');
var session = require('express-session');
var bodyParser = require('body-parser');
var cookieSession = require('cookie-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var counterModule = require('./modules/counterModule');

app.set('trust proxy', 1) // trust first proxy

app.set('views',path.resolve(__dirname,'views'));
app.set('view engine','ejs');
app.use(express.static(path.join(__dirname,"static")));

app.use(session({ 
    secret: 'keyboard cat', 
    resave: true, 
    saveUninitialized: true,
}));

app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));

app.use(passport.initialize());
app.use(passport.session());


app.listen(8081,()=>{
    console.log('server ist up');
});

var User = require('./modules/User.js');
var passportModule = require('./modules/passportModule.js')(passport,User);
var blogModule = require('./modules/blogModule.js');
var codeModule = require('./modules/codeModule.js');
var jsonCreator = require('./modules/jsonCreator.js');
var replyModule = require('./modules/replyModule.js');
var mainModule = require('./modules/mainModule.js');

var main = require('./routes/main.js')(app,counterModule,mainModule,jsonCreator,passport);
var board = require('./routes/board.js')(app,blogModule,codeModule,jsonCreator);
var blog = require('./routes/blog.js')(app,blogModule,jsonCreator);
var code = require('./routes/code.js')(app,codeModule,jsonCreator);
var reply = require('./routes/reply.js')(app,replyModule,jsonCreator);
var account = require('./routes/account.js')(app,jsonCreator,User,passport);
var admin = require('./routes/admin.js')(app,mainModule,jsonCreator);
