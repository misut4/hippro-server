const { default: mongoose } = require("mongoose");
const Project = require("./project.model");
const User = require("./user.model");
const applicationSchema = new mongoose.Schema({
  prjId: {
    type: String,
    ref: Project,
  },
  applicantId: {
    type: String,
    ref: User,
  },
  prjName: {
    type: String,
    ref: Project,
  },
  userField: {
    type: String,
    ref: User,
  },
  prjField: {
    type: String,
    ref: Project,
  },
  userUni: {
    type: String,
    ref: User,
  },
  prjDescription: {
    type: String,
    ref: Project,
  }
});

module.exports = mongoose.model("Application", applicationSchema);
