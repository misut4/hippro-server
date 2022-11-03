const express = require('express')
const router = express.Router()

const {
    getById,
    getAll,
    getAllbyUser,
    getAllReceived,
    createApplication,
    acceptApplication,
    deleteApplication,
    rejectApplication
} = require('../controllers/application.controller')

router.get('/getbyid', getById)

router.get('/getall', getAll)

router.get('/getallappl', getAllbyUser)

router.get('/getallrc', getAllReceived)

router.post('/create', createApplication)

router.put('/accept', acceptApplication)

router.put('/reject', rejectApplication)

router.delete('/delete', deleteApplication)

module.exports = router