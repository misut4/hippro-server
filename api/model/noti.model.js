const { default: mongoose } = require("mongoose");
const notiSchema = new mongoose.Schema({
  content: {
    type: String
  },
  fromUser: {
    type: String
  },
  rcUser: {
    type: String
  }
});

module.exports = mongoose.model("Noti", notiSchema);
