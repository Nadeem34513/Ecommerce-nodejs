const jwt = require('jsonwebtoken')

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.auth_token

    if(!authHeader) return res.status(401).send({msg: "Authentication Failed"})

    jwt.verify(authHeader, process.env.JWT_SEC, (err, user) => {
        if (!user) return res.status(403).send({ msg: "Invalid Token" })
        
        req.user = user
        next()
    })
}

const verifyJWTAndAuthorisation = (req, res, next) => {
    verifyJWT(req, res, () => {
        if (req.user.id == req.params.id || req.user.isAdmin) 
            next()
        else
            res.status(403).send({msg: "NO PERMISSION"}) 
    })
}

const verifyJWTAndAdmin = (req, res, next) => {
    verifyJWT(req, res, () => {
        if (req.user.isAdmin) 
            next()
        else
            res.status(403).send({msg: "NO PERMISSION"}) 
    })
}

module.exports = { verifyJWT, verifyJWTAndAuthorisation, verifyJWTAndAdmin }