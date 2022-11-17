const { default: mongoose } = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require("mongoose-findorcreate");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
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
  bio: {
    type: String
  },
  phone: {
    type: Number
  },
  avatar: {
    type: String,
    default: "https://i.pravatar.cc",
  },
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

module.exports = mongoose.model("User", userSchema);
