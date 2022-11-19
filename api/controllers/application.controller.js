const { default: mongoose } = require("mongoose");
const Application = require("../model/application.model");
const Project = require("../model/project.model");
const User = require("../model/user.model");
const Noti = require("../model/noti.model");

//DEDICATED FUNCTIONS=========================================================
async function findbyId(req, res) {
  const id = req.query.id;
  console.log(req.query.id);
  console.log(id);
  const application = await Application.findById(id).exec();
  console.log(application);
  if (!application) {
    return res.status(200).json({ msg: "failed", code: 400 });
  }
  return res.status(200).json({
    msg: "success",
    code: 200,
  });
}

async function findAll(req, res) {
  await Application.find({ status: { $ne: "Rejected" } })
    .exec()
    .then((application) => {
      return res.json(application);
    })
    .catch((err) => {
      console.log(err);
    });
}

async function findAllbelongToUser(req, res) {
  const userId = req.query.userId;
  console.log(userId);
  await Application.find({ applicantId: userId })
    .exec()
    .then((application) => {
      return res.status(200).json(application);
    })
    .catch((err) => {
      console.log(err);
    });
}

async function findAllReceived(req, res) {
  const userId = req.query.userId;
  const project = await Project.find({ userID: userId }).exec();
  // project.forEach(async project => {
  //   console.log(project._id.toString());
  // });

  var result = project.map((a) => a._id);

  await Application.find({ prjId: result, status: "Pending" })
    .exec()
    .then((application) => {
      return res.json(application);
    })
    .catch((err) => {
      console.log(err);
    });
}

async function createOne(req, res) {
  const prjId = req.body.data.projectId;
  const projectName = await Project.findById(prjId).select("name").exec();
  const projectOwner = await Project.findById(prjId).select("userID").exec();

  const applicantId = req.body.data.userID;
  const prjName = projectName.name;
  const userField = req.body.userField;
  const prjField = req.body.prjField;
  const userUni = req.body.userUni;
  const prjDescription = req.body.prjDescription;

  const role = req.body.data.role;
  const status = req.body.data.status;

  if (projectOwner.userID === applicantId) {
    return res
      .status(200)
      .json({ msg: "Owner cant apply to their project!!1!" });
  }

  //find sender and receiver
  const fromUser = await User.findById(applicantId).exec();
  const rcId = await Project.findById(prjId).select("userID").exec();
  const rcUser = await User.findById(rcId).exec();

  //push noti to prj's owner
  const noti = new Noti({
    content: `${fromUser.email} has sent you an application`,
    fromUser: fromUser,
    rcUser: rcUser,
  }).save();

  const application = new Application({
    prjId,
    applicantId,
    prjName,
    userField,
    prjField,
    userUni,
    prjDescription,
    role,
    status,
  });
  await Project.findByIdAndUpdate(prjId, {
    application: application,
  }).exec();
  await application
    .save()
    .then((result) => {
      return res.status(201).json(result);
    })
    .catch((err) => {
      console.log(err);
    });
}

async function acceptOne(req, res) {
  const applicationId = req.body.data.applicationId;
  const projectId = req.body.data.projectId;
  const applicantId = req.body.data.userID;
  const status = req.body.data.status;

  console.log(status);
  //update application's status
  await Application.findById(applicationId)
    .updateOne({ status: status })
    .exec();

  // await application.save();

  if (!Application.findById(applicationId)) {
    return res.status(200).json({ msg: "id not found", code: 400 });
  }

  //get user's info
  const userEmail = await User.findById(applicantId).select("email").exec();
  const userAvatar = await User.findById(applicantId).select("avatar").exec();

  //update user's info into applied project
  await Project.findById(projectId)
    .updateOne({
      $addToSet: {
        participants: {
          _id: applicantId,
          email: userEmail.email,
          avatar: userAvatar.avatar,
        },
      },
    })
    .exec();

  //update/remove user's application from project
  await Project.findById(projectId)
    .updateOne({ $pull: { application: applicationId } })
    .exec();

  // const project = await Project.findByIdAndUpdate(projectId, {participants: user.name}).exec()

  // //find sender and receiver
  // const fromUser = await User.findById(applicantId).exec();
  // const rcId = await Project.findById(projectId).select("userID").exec();
  // const rcUser = await User.findById(rcId).exec();

  // //push noti to prj's owner
  // const noti = new Noti({
  //   content: `${rcUser.email} has accepted your an application`,
  //   fromUser: fromUser,
  //   rcUser: rcUser,
  // });

  return res.status(200).json(await Application.findById(applicationId));
}

async function rejectOne(req, res) {
  const applicationId = req.body.data.applicationId;
  const projectId = req.body.data.projectId;
  const applicantId = req.body.data.userID;
  const status = "Declined";

  if (!Application.findById(applicationId)) {
    return res.status(200).json({ msg: "id not found", code: 400 });
  }

  // //find sender and receiver
  // const fromUser = await User.findById(applicantId).exec();
  // const rcId = await Project.findById(projectId).select("userID").exec();
  // const rcUser = await User.findById(rcId).exec();

  // //push noti to prj's owner
  // const noti = new Noti({
  //   content: `${rcUser} has accepted your an application`,
  //   fromUser: fromUser,
  //   rcUser: rcUser,
  // });

  //update/remove user's application from project
  await Project.findById(projectId)
    .updateOne({ $pull: { application: applicationId } })
    .exec();

  //update application's status
  await Application.findById(applicationId)
    .updateOne({ status: status })
    .exec()
    .then((result) => {
      return res.status(200).json(result);
    })
    .catch((err) => {
      return console.log(err);
    });
}

async function deleteOne(req, res) {
  const id = req.body.id;

  if (!Application.findById(id)) {
    return res.status(200).json({ msg: "id not found", code: 400 });
  }

  Application.deleteOne({
    _id: id,
  }).exec();

  return res.status(200).json({
    msg: "deleted",
    code: "200",
  });
}

//=====================================================================================

//REST API GET=================================================
const getById = (req, res) => {
  findbyId(req, res);
};

const getAll = (req, res) => {
  findAll(req, res);
  console.log("got all appl");
};

const getAllbyUser = (req, res) => {
  findAllbelongToUser(req, res);
  console.log("got all appl from user");
};

const getAllReceived = (req, res) => {
  findAllReceived(req, res);
  console.log("got all appl from others");
};

//REST API POST=================================================
const createApplication = (req, res) => {
  createOne(req, res);
};
//REST API PUT=================================================
const acceptApplication = (req, res) => {
  acceptOne(req, res);
};

const rejectApplication = (req, res) => {
  rejectOne(req, res);
};
//REST API DELETE=================================================
const deleteApplication = (req, res) => {
  deleteOne(req, res);
};

module.exports = {
  getById,
  getAll,
  getAllbyUser,
  getAllReceived,
  createApplication,
  acceptApplication,
  deleteApplication,
  rejectApplication,
};
