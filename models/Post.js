const mongoose = require('mongoose')
const Schema = mongoose.Schema

const postSchema = new Schema({
    user :{
        type:Schema.Types.ObjectId,
        ref:'users'
    },
    text :{
        type:String,
        require:true
    },
    name :{
        type:String
    },
    avatar :{
        type:String
    } ,
    comments:[
        {
            user :{
                type:Schema.Types.ObjectId,
                ref:'users'
            },
            text :{
                type:String,
                require:true
            },
            name :{
                type:String
            },
            avatar :{
                type:String
            },
            date :{
                type:Date,
                default:Date.now
            },
        }
    ],
    likes: [
        {
            user :{
                type:Schema.Types.ObjectId,
                ref:'users'
            }
        }
    ] ,
    date :{
        type:Date,
        default:Date.now
    }
})

module.exports = Post = mongoose.model('post',postSchema)