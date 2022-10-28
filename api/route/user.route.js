const express = require('express')
const router = express.Router()

const {
    getById,
    getAll,
    createUser,
    updateUser
} = require('../controllers/user.controller')

router.get('/getbyid', getById)

router.get('/getalluser', getAll)

router.post('/create', createUser)

router.put('/update', updateUser)

module.exports = router