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

async function findAll(req, res) {
  const pageOptions = {
    page: parseInt(req.query.page, 10) || 0,
    limit: parseInt(req.query.limit, 10) || 10,
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
  const name = req.body.name;
  const location = req.body.location;
  const post_date = req.body.post_date;
  const end_date = req.body.end_date;
  const skill = req.body.skill;
  const field = req.body.field;
  const criteria = req.body.criteria;
  const uni = req.body.uni;
  const amount = req.body.amount;
  const description = req.body.description;
  const category = req.body.category;

  // if (!email || !username || !password) {
  //     res.status(422).json({ error: "Please add all the fields" })
  // }
  //make password not show on database
  // req.user.password = undefined
  const project = new Project({
    //key and value are the same so only need to type one
    name,
    location,
    post_date,
    end_date,
    skill,
    field,
    criteria,
    uni,
    amount,
    description,
    category,
  });
  project
    .save()
    .then((result) => {
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
  const post_date = req.body.post_date;
  const end_date = req.body.end_date;
  const skill = req.body.skill;
  const field = req.body.field;
  const criteria = req.body.criteria;
  const uni = req.body.uni;
  const amount = req.body.amount;
  const description = req.body.description;
  const category = req.body.category;

  if (!Project.findById(_id)) {
    return res.status(200).json({ msg: "id not found", code: 400 });
  }

  // req.user.password = undefined
  const project = new Project({
    //key and value are the same so only need to type one
    name,
    location,
    post_date,
    end_date,
    skill,
    field,
    criteria,
    uni,
    amount,
    description,
    category,
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
  const id = req.query.id;

  if (!Project.findById(id)) {
    return res.status(200).json({ msg: "id not found", code: 400 });
  }

  console.log(id);
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
  createPrj,
  updatePrj,
  deletePrj,
};
