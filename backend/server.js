const cors = require('cors');
const express = require("express");
const bodyParser = require("body-parser");
const passport = require('passport');
const passportConfig = require("./app/models/passport"); 
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const flash = require('connect-flash');
const app = express();


app.use(express.static('public'));

app.use(
  cors({
    origin: 'http://localhost:8080',
    credentials: true
  })
);

// app.use(cors());

// parse requests of content-type: application/json
app.use(bodyParser.json());

// parse requests of content-type: application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// 로그인 세션 
var options = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'Tmddus38*',
  database: 'taskmanagement'
}
  
var sessionStore = new MySQLStore(options);

app.use(
  session({
    secret:"#JDKLF439jsdlfsjl",
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    // cookie: {
    //   maxAge: 1000 * 60 * 30 // 쿠키 유효시간 30분  
    // }
  })
);

app.use(passport.initialize()); // passport를 사용하겠다. (passport 구동)
app.use(passport.session());    // 우리의 passport는 내부적으로 session을 쓰겠다. (세션 연결)
app.use(flash());


passportConfig();


require("./app/routes/user.routes.js")(app);
require("./app/routes/task.routes.js")(app);
require("./app/routes/detailTask.routes.js")(app);

app.get("/session", function(req, res){
  console.log("req.isAuthenticated(): " + req.isAuthenticated())
  console.log("session req.session: " + JSON.stringify(req.session));
  if (req.isAuthenticated()){
      console.log("session 있음");
      res.send({auth: true});
  }
  else{
      console.log("session 없음");
      res.send({auth: false});
  }
});

// simple route
app.get("/", (req, res) => {
  // console.log('/', req.user);
  console.log("/")
  // res.json({ message: "Welcome to bezkoder application." });
});

// set port, listen for requests
app.listen(3000, () => {
  console.log("Server is running on port 3000.");
});
