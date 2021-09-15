const router = require('express').Router()
const { verifyJWT, verifyJWTAndAuthorisation, verifyJWTAndAdmin } = require('./verifyJWT')
const bcrypt = require('bcryptjs')
const User = require('../model/User')

// UPDATING USER
router.put('/:id', verifyJWTAndAuthorisation, async (req, res) => {
    // CHECKING IF USER HAD CHANGED THE PASSWORD AND ENCRYPTING IT
    if (req.body.password) {
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(req.body.password, salt)
        req.body.password = hash
    }

    User.findByIdAndUpdate(req.params.id, {
        $set: req.body
    }, { new: true })
        .then((user) => res.status(200).send({ msg: "Success ", user }))
        .catch(err => res.status(500).send({ msg: "Some Error ", err }))
})

// DELETING USER
router.delete('/:id', verifyJWTAndAuthorisation, (req, res) => {
    User.findByIdAndDelete(req.params.id)
        .then(deletedUser => {
            if(!deletedUser) return res.status(400).send({ msg: "User Has Been Already Deleted" })
            res.status(200).send({ msg: "User Has Been Deleted ", deletedUser })
        })
        .catch(err => res.status(500).send({ msg: "Cannot Delete The User, LOL ", err }))
})

// GETTING A USER
router.get('/find/:id', verifyJWTAndAdmin, (req, res) => {
    User.findById(req.params.id)
        .then(currentUser => {
            const {password, ...user} = currentUser._doc
            res.status(200).send(user)
        })
        .catch(err => res.status(500).send({msg: "Some Error", err}))
})

// GETTING ALL USERS
router.get('/', verifyJWTAndAdmin, (req, res) => {
    User.find().then(users => res.send(users)).catch(err => res.send(err))
})

module.exports = router