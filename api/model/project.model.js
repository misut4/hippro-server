const { default: mongoose } = require("mongoose");
const projectSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  location: {
    type: String,
  },
  post_date: {
    type: Date,
  },
  end_date: {
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
  description: {
    type: String,
  },
  userId: {
    type: String
  }
});

module.exports = mongoose.model("Project", projectSchema);
