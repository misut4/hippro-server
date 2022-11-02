const Application = require("../model/application.model");
const Project = require("../model/project.model");


//DEDICATED FUNCTIONS=========================================================
async function findbyId(req, res) {
  const id = req.query.id;
  console.log(req.query.id);
  console.log(id);
  const application = await Application.findById(id).exec()
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
  Application.find().exec()
    .then((application) => {
      return res.json(application);
    })
    .catch((err) => {
      console.log(err);
    });
}

async function createOne(req, res) {
  const prjId = req.body.prjId
  const applicantId = req.body.applicantId
  const prjName = req.body.prjName
  const userField = req.body.userField
  const prjField = req.body.prjField
  const userUni = req.body.userUni
  const prjDescription = req.body.prjDescription

  
  const application = new Application({
    prjId,
    applicantId,
    prjName,
    userField,
    prjField,
    userUni,
    prjDescription
  });
  const project = await Project.findByIdAndUpdate(prjId, {application: application}).exec()
  application
    .save()
    .then((result) => {
      return res.json(result, project);
    })
    .catch((err) => {
      console.log(err);
    });
}

async function updateOne(req, res) {
  const _id = req.body._id
  const prjId = req.body.prjId
  const applicantId = req.body.applicantId
  const prjName = req.body.prjName
  const userField = req.body.userField
  const prjField = req.body.prjField
  const userUni = req.body.userUni
  const prjDescription = req.body.prjDescription

  if (!Application.findById(_id)) {
    return res.status(200).json({ msg: "id not found", code: 400 });
  }

  const application = new Application({
    prjId,
    applicantId,
    prjName,
    userField,
    prjField,
    userUni,
    prjDescription
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
  console.log("here");
};
//REST API POST=================================================
const createApplication = (req, res) => {
  createOne(req, res);
};
//REST API PUT=================================================
// const updatePrj = (req, res) => {
//   updateOne(req, res);
// };
//REST API DELETE=================================================
const deleteApplication = (req, res) => {
  deleteOne(req, res);
};

module.exports = {
  getById,
  getAll,
  createApplication,
  deleteApplication
};
