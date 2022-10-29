const express = require('express')
const router = express.Router()

const {
    getById,
    getByEmail,
    getAll,
    createUser,
    updateUser
} = require('../controllers/user.controller')

router.get('/getbyid', getById)

router.get('/getbyemail', getByEmail)

router.get('/getalluser', getAll)

router.post('/create', createUser)

router.put('/update', updateUser)

module.exports = router