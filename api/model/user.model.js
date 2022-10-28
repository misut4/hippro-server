const { default: mongoose } = require("mongoose");
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
  avatar: {
    type: String,
    default: "https://cdn-icons-png.flaticon.com/512/147/147142.png",
  },
});

module.exports = mongoose.model("User", userSchema);
