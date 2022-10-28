const express = require('express')
const router = express.Router()

const {
    getById,
    getAll,
    createPrj,
    updatePrj,
    deletePrj
} = require('../controllers/project.controller')

router.get('/getbyid', getById)

router.get('/getallprj', getAll)

router.post('/create', createPrj)

router.put('/update', updatePrj)

router.delete('/delete', deletePrj)

module.exports = router