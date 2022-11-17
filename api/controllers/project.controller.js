const { updateMany } = require("../model/project.model");
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
  // const searchName = req.query.name || "";
  const searchUni = req.query.university || "";
  const searchLocation = req.query.location || "HCM";
  // console.log(searchName);
  console.log(searchUni);

  const pageOptions = {
    page: parseInt(req.query.page, 10) || 0,
    limit: parseInt(req.query.limit, 10) || 6,
    lastPage: Math.round(
      parseInt(
        await Project.find({
          // name: { $regex: searchName, $options: "i" },
          uni: { $regex: searchUni, $options: "i" },
          location: { $regex: searchLocation, $options: "i" },
          status: { $ne: "Pending" },
        })
          .countDocuments()
          .exec()
      ) / 6
    ),
  };

  await Project.find({
    // name: { $regex: searchName, $options: "i" },
    uni: { $regex: searchUni, $options: "i" },
    location: { $regex: searchLocation, $options: "i" },
    status: { $ne: "Pending" },
  })
    .sort({ endDate: -1 })
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

async function findByName(req, res) {
  const searchName = req.query.name || "";
  console.log(searchName);

  const pageOptions = {
    page: parseInt(req.query.page, 10) || 0,
    limit: parseInt(req.query.limit, 10) || 6,
    lastPage: Math.round(
      parseInt(
        await Project.find({ status: { $nin: ["Pending", "Expired"] } })
          .countDocuments()
          .exec()
      ) / 6
    ),
  };

  await Project.find({
    name: { $regex: searchName, $options: "i" },
    status: { $ne: "Pending" },
  })
    .sort({ endDate: -1 })
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

async function findAll(req, res) {
  const pageOptions = {
    page: parseInt(req.query.page, 10) || 0,
    limit: parseInt(req.query.limit, 10) || 6,
    lastPage: Math.round(
      parseInt(
        await Project.find({ status: { $nin: ["Pending", "Expired"] } })
          .countDocuments()
          .exec()
      ) / 6
    ),
  };

  await setExpired();

  await Project.find({ status: { $nin: ["Pending", "Expired"] } })
    .sort({ endDate: -1 })
    .skip(pageOptions.page * pageOptions.limit)
    .limit(pageOptions.limit)
    .exec()
    .then((project) => {
      return res.status(200).json({ msg: "success", pageOptions, project });
    })
    .catch((err) => {
      console.log(err);
    });
}

async function findAll_admin(req, res) {
  const pageOptions = {
    page: parseInt(req.query.page, 10) || 0,
    limit: parseInt(req.query.limit, 10) || 6,
    lastPage: Math.round(
      parseInt(await Project.find().countDocuments().exec()) / 6
    ),
  };

  await setExpired();

  await Project.find()
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

async function findByUser(req, res) {
  const userID = req.query.id;

  const projects = await Project.find({ userID: userID }).exec();
  const count = await Project.find({ userID: userID }).countDocuments().exec();

  return res.status(200).json({ count: count, projects: projects });
}

async function setExpired() {
  const currentDate = new Date();
  await Project.find({ endDate: { $lt: currentDate } })
    .updateMany({ $set: { status: "Expired" } })
    .exec();
}

async function sortByDesc(req, res) {
  await Project.find()
    .sort({ startDate: -1 })
    .exec()
    .then((result) => {
      return res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
    });
}

async function sortByAsc(req, res) {
  await Project.find()
    .sort({ startDate: 1 })
    .exec()
    .then((result) => {
      return res.status(200).json(result);
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
  const status = "Pending";

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
    status,
  });
  project
    .save()
    .then((result) => {
      console.log("project created");
      return res.status(201).json(result);
    })
    .catch((err) => {
      console.log(err);
    });
}

async function approveProject(req, res) {
  const id = req.body.data.projectId;
  console.log(id);
  await Project.findByIdAndUpdate(id, {
    status: "Approved",
  })
    .exec()
    .then((result) => {
      return res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
    });
}

async function declineProject(req, res) {
  const id = req.body.data.projectId;
  await Project.findByIdAndUpdate(id, {
    status: "Declined",
  })
    .exec()
    .then((result) => {
      return res.status(200).json(result);
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
      return res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
    });
}

async function deleteOne(req, res) {
  const id = req.body.projectId;
  console.log(id);

  if (!Project.findById(id)) {
    return res.status(200).json({ msg: "id not found", code: 400 });
  }

  // console.log(await Project.findById(id).exec())
  Project.deleteOne({
    _id: id,
  })
    .exec()
    .then((result) => {
      return res.status(200).json({ msg: "success", result });
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

const getAll_admin = (req, res) => {
  findAll_admin(req, res);
};

const getAllByUser = (req, res) => {
  findByUser(req, res);
};

const sortByDescDate = (req, res) => {
  sortByDesc(req, res);
};

const sortByAscDate = (req, res) => {
  sortByAsc(req, res);
};

const search = (req, res) => {
  findByText(req, res);
};

const searchName = (req, res) => {
  findByName(req, res);
};
//REST API POST=================================================
const createPrj = (req, res) => {
  createOne(req, res);
};
//REST API PUT=================================================
const updatePrj = (req, res) => {
  updateOne(req, res);
};

const approve = (req, res) => {
  approveProject(req, res);
};

const decline = (req, res) => {
  declineProject(req, res);
};

const expire = (req, res) => {
  setExpired(req, res);
};

//REST API DELETE=================================================
const deletePrj = (req, res) => {
  deleteOne(req, res);
};

module.exports = {
  getById,
  getAll,
  getAll_admin,
  getAllByUser,
  sortByDescDate,
  sortByAscDate,
  search,
  searchName,
  approve,
  decline,
  expire,
  createPrj,
  updatePrj,
  deletePrj,
};
