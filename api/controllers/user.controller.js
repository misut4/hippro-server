const User = require("../model/user.model");

//DEDICATED FUNCTIONS=========================================================
async function findbyId(req, res) {
  const id = req.query.id;
  console.log(req.query.id);
  console.log(id);
  const user = await User.findById(id).exec()
  console.log(user);
  if (!user) {
    return res.status(200).json({ msg: "failed", code: 400 });
  }
  return res.status(200).json({
    msg: "success",
    code: 200,
  });
}

async function findAll(req, res) {
  User.find().exec()
    .then((user) => {
      return res.json(user);
    })
    .catch((err) => {
      console.log(err);
    });
}

async function createOne(req, res) {
  const name = req.body.name;
  const password = req.body.password;
  const skillset = req.body.skillset;
  const uni = req.body.uni;
  const avatar = req.body.avatar;
  const prj_id = req.body.prj_id;

  // if (!email || !username || !password) {
  //     res.status(422).json({ error: "Please add all the fields" })
  // }
  //make password not show on database
  // req.user.password = undefined
  const user = new User({
    //key and value are the same so only need to type one
    name,
    password,
    email,
    skillset,
    uni,
    prj_id,
    avatar,
  });
  user
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
  const password = req.body.password;
  const skillset = req.body.skillset;
  const uni = req.body.uni;
  const avatar = req.body.avatar;
  const prj_id = req.body.prj_id;

  if (!User.findById(_id)) {
    return res.status(200).json({ msg: "id not found", code: 400 });
  }

  // req.user.password = undefined
  const user = new User({
    //key and value are the same so only need to type one
    name,
    password,
    email,
    skillset,
    uni,
    prj_id,
    avatar,
  });
  user
    .update()
    .then((result) => {
      return res.json(result);
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
};
//REST API POST=================================================
const createUser = (req, res) => {
  createOne(req, res);
};
//REST API PUT=================================================
const updateUser = (req, res) => {
  updateOne(req, res);
};

//REST API DELETE=================================================

module.exports = {
  getById,
  getAll,
  createUser,
  updateUser,
};
