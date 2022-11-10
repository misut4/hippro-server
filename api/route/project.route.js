const express = require('express')
const router = express.Router()

const {
    getById,
    getAll,
    getAllByUser,
    sortByDescDate,
    sortByAscDate,
    search,
    createPrj,
    updatePrj,
    deletePrj
} = require('../controllers/project.controller')

router.get('/getbyid', getById)

router.get('/getallprj', getAll)

router.get('/getbyuser', getAllByUser)

router.get('/sortdesc', sortByDescDate)

router.get('/sortasc', sortByAscDate)

router.get('/search', search)

router.post('/create', createPrj)

router.put('/update', updatePrj)

router.delete('/delete', deletePrj)

module.exports = router