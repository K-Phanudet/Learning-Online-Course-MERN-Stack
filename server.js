const express = require('express');
const {mongoConnect} = require('./config/db')

const app = express();
const api = express()
const PORT = process.env.PORT || 5000
app.use(express.json({extended:true}))
// Connect db
mongoConnect()

// Init middleware
app.get('/',(req,res)=>res.send('API running'))

// Defines Routes
api.use('/users',require('./routes/api/users'))
api.use('/profile',require('./routes/api/profile'))
api.use('/posts',require('./routes/api/posts'))
api.use('/auth',require('./routes/api/auth'))

app.use('/api',api)



app.listen(PORT,()=>{
    console.log(`Server started on port ${PORT}`)
})