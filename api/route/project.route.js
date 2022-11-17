const express = require("express");
const router = express.Router();

const {
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
  createPrj,
  updatePrj,
  deletePrj,
} = require("../controllers/project.controller");

router.get("/getbyid", getById);

router.get("/getallprj", getAll);

router.get("/admingetall", getAll_admin);

router.get("/getbyuser", getAllByUser);

router.get("/sortdesc", sortByDescDate);

router.get("/sortasc", sortByAscDate);

router.get("/search", search);

router.get("/searchname", searchName);

router.post("/create", createPrj);

router.put("/update", updatePrj);

router.put("/approve", approve);

router.put("/decline", decline);

router.delete("/delete", deletePrj);

module.exports = router;
