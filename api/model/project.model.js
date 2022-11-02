const { default: mongoose } = require("mongoose");
const projectSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  location: {
    type: String,
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  shortDesc: {
    type: String,
  },
  field: {
    type: Array,
  },
  uni:{
    type: String
  },
  amount: {
    type: String,
  },
  desc: {
    type: String,
  },
  userID: {
    type: String
  },
  application: {
    type: Array
  },
  participants: {
    type: Array
  }

});

module.exports = mongoose.model("Project", projectSchema);
