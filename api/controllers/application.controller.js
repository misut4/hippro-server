const Application = require("../model/application.model");

//DEDICATED FUNCTIONS=========================================================
async function findbyId(req, res) {
  const id = req.query.id;
  console.log(req.query.id);
  console.log(id);
  const application = await Application.findById(id).exec()
  console.log(project);
  if (!project) {
    return res.status(200).json({ msg: "failed", code: 400 });
  }
  return res.status(200).json({
    msg: "success",
    code: 200,
  });
}

async function findAll(req, res) {
  Application.find().exec()
    .then((project) => {
      return res.json(project);
    })
    .catch((err) => {
      console.log(err);
    });
}

async function createOne(req, res) {
  

  // if (!email || !username || !password) {
  //     res.status(422).json({ error: "Please add all the fields" })
  // }
  //make password not show on database
  // req.user.password = undefined
  const application = new Application({
    //key and value are the same so only need to type one
    
  });
  application
    .save()
    .then((result) => {
      return res.json(result);
    })
    .catch((err) => {
      console.log(err);
    });
}

async function updateOne(req, res) {
  

  if (!Application.findById(_id)) {
    return res.status(200).json({ msg: "id not found", code: 400 });
  }

  // req.user.password = undefined
  const application = new Application({
    //key and value are the same so only need to type one
    
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

  if (!Project.findById(id)) {
    return res.status(200).json({ msg: "id not found", code: 400 });
  }

  Project.deleteOne({
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
