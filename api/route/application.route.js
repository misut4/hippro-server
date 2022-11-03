const express = require('express')
const router = express.Router()

const {
    getById,
    getAll,
    getAllbyUser,
    createApplication,
    deleteApplication
} = require('../controllers/application.controller')

router.get('/getbyid', getById)

router.get('/getall', getAll)

router.get('/getallappl', getAllbyUser)

router.post('/create', createApplication)

router.delete('/delete', deleteApplication)

module.exports = router