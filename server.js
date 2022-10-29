const express = require("express"); // Sử dụng framework express
const { default: mongoose } = require("mongoose");
const app = express();
const cors = require("cors");
const serverless = require("serverless-http");
const { createProxyMiddleware } = require("http-proxy-middleware");
const port = parseInt(process.env.PORT, 10) || 5000
require("dotenv").config();

const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const findOrCreate = require("mongoose-findorcreate");

//=========================================================================================================================================================
//API ROUTES
const project = require("./api/route/project.route");
const user = require("./api/route/user.route");
const appl = require("./api/route/application.route");
const auth = require("./api/utils/auth");

//=========================================================================================================================================================
//Google Auth
app.use(session({
  secret: "Our little secret.",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

//=========================================================================================================================================================
//CONNECT DATABASE
mongoose.connect(
  "mongodb+srv://kimdat0705:kimdatkimdat0705@cluster0.duoyvfe.mongodb.net/hippro"
);

mongoose.connection.on("connected", () => {
  console.log("> Connected to MongoDB");
});
mongoose.connection.on("error", (err) => {
  console.log("err connecting", err);
});

//=========================================================================================================================================================
//SCHEMA MODEL
require("./api/model/project.model");
const userSchema = require("./api/model/user.model");
require("./api/model/application.model");

// passport.use(userSchema.createStrategy());
const LocalStrategy = require('passport-local').Strategy;
passport.use(new LocalStrategy(userSchema.authenticate()));
passport.serializeUser(function(user, done) {
  done(null, user.id);
});
passport.deserializeUser(function(id, done) {
  userSchema.findById(id, function(err, user) {
    done(err, user);
  });
});
passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:5000/auth/google/callback",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
  },
  function(accessToken, refreshToken, profile, cb) {
    userSchema.findOrCreate({ googleId: profile.id, username: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));


app.get("/auth/google",
  passport.authenticate("google", { scope: ["profile"] })
);
app.get("/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "http://localhost:5000" }),
  function(req, res) {
    // Successful authentication, redirect secrets.
    res.redirect("http://localhost:5000");
  }
);

app.get("/logout", function(req, res){
  res.redirect("http://localhost:3000/");
});
//=========================================================================================================================================================
//APP/SERVER

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "http://localhost:5000",
      changeOrigin: true,
    })
  );
};

app.use(cors());

// Add headers
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});

//parse form data
app.use(express.urlencoded({ extended: false }));

//parse json
app.use(express.json());

//route
app.use("/api", auth);
app.use("/api/prj", project);
app.use("/api/user", user);
app.use("/api/appl", appl);

app.listen(port, (err) => {
  if (err) throw err;
  console.log(`> Ready on http://localhost:${port}`);
});

module.exports = app;
module.exports.handler = serverless(app);
