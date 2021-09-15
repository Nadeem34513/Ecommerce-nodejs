const router = require('express').Router()
const bcrypt = require('bcryptjs')
const User = require('../model/User')
const jwt = require('jsonwebtoken')

// REGISTER
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body

    if (username && email && password) {
        const newUser = new User({ username, email, password })

        try {
            // HASHING PASSWORD 
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(password, salt)
            newUser.password = hashedPassword

            // SAVING NEW USER
            const savedUser = await newUser.save()
            res.status(201).send(savedUser)
        } catch (error) {
            res.status(500).send(error)
        }
    } else {
        res.status(400).json("ENTER CREDENTIALS")
    }

})

// router.post('/login', async (req, res) => {
//     const {email, password} = req.body

//     if (email && password) {
//         const user = await User.findOne({ email })
//         if (!user)
//             return res.status(400).send({ msg: "No User Registered With That Email" })
        
//         const pass = await bcrypt.compare(password, user.password)
//         if(pass)
//             res.status(200).send(user)
//         else
//             res.status(400).send({msg: "Password Incorect"})
//     } else
//         res.status(500).send({msg: "All Fields Need To Be Filled"})
// })

router.post('/login', (req, res) => {
    const { email, password } = req.body
    
    if (!email || !password)
        return res.status(500).send({msg: "All Fields Are To Be Filled"})

    User.findOne({ email })
        .then(user => {
            if (!user) return res.status(400).send({ msg: "No User Registered With That Email" })

            bcrypt.compare(password, user.password, (err, success) => {
                if (!success) return res.status(500).send({ msg: "Password Incorrect"})  
                
                const { password, ...info } = user._doc
                const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SEC)
                res.header('auth_token', token) // OPTIONAL
                res.status(200).send({ msg: "Login Success ", info, token})
            })
        })
        .catch(err => res.status(500).send({ msg: "Some error ", err}))
})

module.exports = router
