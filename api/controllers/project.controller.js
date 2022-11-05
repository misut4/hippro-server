const Project = require("../model/project.model");

//DEDICATED FUNCTIONS=========================================================
async function findbyId(req, res) {
  const id = req.query.id;
  console.log(id);
  const project = await Project.findById(id).exec();
  console.log(project);
  if (!project) {
    return res.status(200).json({ msg: "failed", code: 400 });
  }
  return res.status(200).json({
    msg: "success",
    code: 200,
  });
}

async function findByText(req, res) {
  const searchName = req.query.name || "";
  const searchUni = req.query.uni || "";
  console.log(searchName);
  console.log(searchUni);
  const project = await Project.find({
    name: { $regex: searchName, $options: "i" },
    uni: { $regex: searchUni, $options: "i" },
  });
  if (!project) {
    return res.status(200).json({ msg: "failed", code: 400 });
  }
  return res.status(200).json(project);
}

async function findAll(req, res) {
  const pageOptions = {
    page: parseInt(req.query.page, 10) || 0,
    limit: parseInt(req.query.limit, 10) || 1000,
  };

  Project.find()
    .skip(pageOptions.page * pageOptions.limit)
    .limit(pageOptions.limit)
    .exec()
    .then((project) => {
      return res.json({ msg: "success", pageOptions, project });
    })
    .catch((err) => {
      console.log(err);
    });
}

async function createOne(req, res) {
  const name = req.body.data.name;
  const location = req.body.data.location;
  const startDate = req.body.data.startDate;
  const endDate = req.body.data.endDate;
  const shortDesc = req.body.data.shortDesc;
  const field = req.body.data.field;
  const uni = req.body.data.uni;
  const userID = req.body.data.userID;
  const desc = req.body.data.desc;
  const applications = req.body.data.applications;
  const participants = req.body.data.participants;

  const project = new Project({
    //key and value are the same so only need to type one
    name,
    location,
    startDate,
    endDate,
    shortDesc,
    field,
    uni,
    userID,
    desc,
    applications,
    participants,
  });
  project
    .save()
    .then((result) => {
      console.log("project created");
      return res.json(result);
    })
    .catch((err) => {
      console.log(err);
    });
}

async function updateOne(req, res) {
  const _id = req.body._id;
  const name = req.body.name;
  const location = req.body.location;
  const startDate = req.body.post_date;
  const endDate = req.body.end_date;
  const shortDesc = req.body.shortDesc;
  const field = req.body.inputFields;
  const uni = req.body.uni;
  const desc = req.body.desc;
  const applications = req.body.data.applications;
  const participants = req.body.data.participants;

  if (!Project.findById(_id)) {
    return res.status(200).json({ msg: "id not found", code: 400 });
  }

  // req.user.password = undefined
  const project = new Project({
    //key and value are the same so only need to type one
    name,
    location,
    startDate,
    endDate,
    shortDesc,
    field,
    uni,
    desc,
    applications,
    participants,
  });
  project
    .update(_id)
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

  console.log(id);
  Project.deleteOne({
    _id: id,
  }).exec().then((result) => {
    return res.json({ msg: "success", result });
  })
  .catch((err) => {
    console.log(err);
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

const search = (req, res) => {
  findByText(req, res);
};
//REST API POST=================================================
const createPrj = (req, res) => {
  createOne(req, res);
};
//REST API PUT=================================================
const updatePrj = (req, res) => {
  updateOne(req, res);
};
//REST API DELETE=================================================
const deletePrj = (req, res) => {
  deleteOne(req, res);
};

module.exports = {
  getById,
  getAll,
  search,
  createPrj,
  updatePrj,
  deletePrj,
};
