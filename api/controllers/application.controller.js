const Application = require("../model/application.model");
const Project = require("../model/project.model");
const User = require("../model/user.model");

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

  await Application.find({ prjId: result })
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
  const project = await Project.findById(prjId).exec();

  const applicantId = req.body.data.userID;
  const prjName = project.name;
  const userField = req.body.userField;
  const prjField = req.body.prjField;
  const userUni = req.body.userUni;
  const prjDescription = req.body.prjDescription;

  const role = req.body.data.role;
  const status = req.body.data.status;

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
  const applicationId = req.body.applicationId;
  const projectId = req.body.projectId;
  const userId = req.body.userId;
  const status = req.body.status;

  if (!Application.findById(applicationId)) {
    return res.status(200).json({ msg: "id not found", code: 400 });
  }

  const userEmail = await User.findById(userId).select("email").exec();
  const project = Project.findById(projectId);
  project.updateOne({ $push: { participants: userEmail } });

  // const project = await Project.findByIdAndUpdate(projectId, {participants: user.name}).exec()

  const application = await Application.findByIdAndUpdate(applicationId, {
    status: status,
  })
    .exec()
    .then((result) => {
      return res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
    });
}

async function rejectOne(req, res) {
  const id = req.body.applicantId;
  const status = req.body.status;

  if (!Application.findById(id)) {
    return res.status(200).json({ msg: "id not found", code: 400 });
  }

  const application = new Application({
    status,
  });
  application
    .update()
    .then((result) => {
      return res.json(result);
    })
    .catch((err) => {
      console.log(err);
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
