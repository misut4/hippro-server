const Noti = require("../model/noti.model");

async function findAllNoti(req, res) {
  await Noti.find()
    .exec()
    .then((result) => {
      return res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
    });
}

async function deleteNoti(req, res) {
    await Noti.findByIdAndDelete(req.body.id).exec()

    return res.status(200).json("deleted");
}

const getAll = (req, res) => {
    findAllNoti(req, res)
}

const deleteOne = (req, res) => {
    deleteNoti(req, res)
}

module.exports = {
    getAll,
    deleteOne    
  };
  