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
  skill: {
    type: String,
  },
  field: {
    type: String,
  },
  criteria: {
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
  category: {
    type: Array,
  },
  userId: {
    type: String
  }
});

module.exports = mongoose.model("Project", projectSchema);
