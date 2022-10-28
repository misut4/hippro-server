const express = require('express')
const router = express.Router()

const {
    getById,
    getAll,
    createApplication,
    deleteApplication
} = require('../controllers/application.controller')

router.get('/getbyid', getById)

router.get('/getallprj', getAll)

router.post('/create', createApplication)

router.delete('/delete', deleteApplication)

module.exports = router