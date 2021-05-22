const mongoose = require('mongoose')

const UserSchema  = new mongoose.Schema({
    name :{
        require:true,
        type:String
    },
    email:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    avatar:{
        type:String
    },
    date:{
        type:Date,
        default:Date.Now
    }
})

module.exports = User = mongoose.model('user',UserSchema)