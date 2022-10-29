const { default: mongoose } = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
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

module.exports = mongoose.model("User", userSchema);
