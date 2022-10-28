const { default: mongoose } = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const findOrCreate = require("mongoose-findorcreate");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  username: {
    type: String,
  },
  googleId: {
    type: String
  },
  secret: {
    type: String
  },
  password: {
    type: String
  },
  email: {
    type: String,
  },
  skillset: {
    type: Array,
  },
  uni: {
    type: String,
  },
  avatar: {
    type: String,
    default: "https://cdn-icons-png.flaticon.com/512/147/147142.png",
  },
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);


// passport.use(userSchema.createStrategy());
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
module.exports = mongoose.model("User", userSchema);
