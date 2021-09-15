const express = require('express'); 
const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()

const app = express() 

// MIDDLEWARES
app.use(express.json())
app.use(express.urlencoded({extended: false}))

// DB
mongoose.connect(process.env.dbURI)
mongoose.connection.once('open', () => console.log('DB connected'))

// ROUTES
app.use('/api/auth', require('./routes/auth')) 
app.use('/api/user', require('./routes/user'))
// PORT
const PORT = process.env.PORT || 8000 
app.listen(PORT, () => console.log(`Server running on ${PORT}`))