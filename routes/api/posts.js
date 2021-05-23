const express = require('express')
const { verifyToken } = require('../../middleware/auth')
const router = express.Router()
const {check,validationResult} = require('express-validator')

const Post = require('../../models/Post')
const Profile = require('../../models/Profile')
const User = require('../../models/Users')
// @route POST /api/posts
// @desc  create post 
// @access Private
router.post('/',[
verifyToken,
[
    check('text','Text is require').notEmpty()
]
],async(req,res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    try{
        // Find user data by id 
        const user = await User.findById(req.user.id).select('-password')
        // create new object of schema posts 
        const post = new Post({
            user:req.user.id,
            text:req.body.text,
            avatar:user.avatar,
            name:user.name
        })

        // save post
        await post.save()
        res.json(post)
    }catch(err){
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})

// @route GET /api/posts
// @desc  GET posts
// @access Private
router.get('/',verifyToken,async(req,res)=>{
    try{
        const posts = await Post.find().sort({date:-1})
    
        res.json(posts)
    }catch(err){
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})

// @route GET /api/posts/:id
// @desc  GET posts
// @access Private
router.get('/:id',verifyToken,async(req,res)=>{
    try{
        const post = await Post.findById({_id:req.params.id})
        if(!post){
            return res.status(404).json({msg:'Post not found'})
        }
        res.json(post)
    }catch(err){
        if(err.kind=="ObjectId"){
            return res.status(404).json({msg:'Post not found'})
        }
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})

// @route DELETE /api/posts/:id
// @desc  DELETE post
// @access Private
router.delete('/:id',verifyToken,async(req,res)=>{
    try{
        const post = await Post.findById({_id:req.params.id}) 
        if(!post){
            return res.status(404).json({msg:'Post not found'})
        }
        if(req.user.id !== post.user.toString()){
            return res.status(401).json({msg:'User not authorized'})
        }
        await post.remove()
        res.json({msg:'Post removed'})
    }catch(err){
        if(err.kind=="ObjectId"){
            return res.status(404).json({msg:'Post not found'})
        }
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})

// @route PUT /api/posts/like/:id
// @desc  like post
// @access Private
router.put('/like/:id',verifyToken,async(req,res)=>{
    try{
        const post = await Post.findById(req.params.id) 
        if(!post){
            return res.status(404).json({msg:'Post not found'})
        }
        console.log(post.likes.filter(like=>like.user.toString()),req.user.id)
        if(post.likes.filter(like=>like.user.toString()===req.user.id).length > 0){
            return res.status(400).json({msg:'Post already like'})
        }
        post.likes.unshift({user:req.user.id})
        await post.save()
        res.json(post.likes)
    }catch(err){
        if(err.kind=="ObjectId"){
            return res.status(404).json({msg:'Post not found'})
        }
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})

// @route PUT /api/posts/unlike/:id
// @desc  unlike post
// @access Private
router.put('/unlike/:id',verifyToken,async(req,res)=>{
    try{
        const post = await Post.findById(req.params.id) 
        if(!post){
            return res.status(404).json({msg:'Post not found'})
        }

        const removeIdx = post.likes.map(like=>like.user.toString()).indexOf(req.user.id)
        if(removeIdx < 0){
            return res.status(400).json({msg:'Post has not yet been liked'})
        }
        post.likes.splice(removeIdx,1)
        await post.save()
        res.json(post.likes)
    }catch(err){
        if(err.kind=="ObjectId"){
            return res.status(404).json({msg:'Post not found'})
        }
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})

// @route POST /api/posts/comment/:id
// @desc  create comment 
// @access Private
router.post('/comment/:id',[
    verifyToken,
    [
        check('text','Text is require').notEmpty()
    ]
    ],async(req,res)=>{
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()})
        }
        try{
            // Find Post & user
            const user = await User.findById(req.user.id).select('-password')
            const post = await Post.findById(req.params.id)
            if(!post){
                return res.status(404).json({msg:"Post not found"})
            }
            // create new object of schema posts 
            const comment = new Post({
                user:req.user.id,
                text:req.body.text,
                avatar:user.avatar,
                name:user.name
            })
            post.comments.unshift(comment)
            // save post
            await post.save()
            res.json(post.comments)
        }catch(err){
            if(err.kind=="ObjectId"){
                return res.status(404).json({msg:'Post not found'})
            }
            console.error(err.message)
            res.status(500).send('Server Error')
        }
    })


// @route DELETE /api/posts/comment/:id/:commentId
// @desc  delete comment 
// @access Private
router.delete('/comment/:id/:commentId',verifyToken,async(req,res)=>{
    try{
        const {id,commentId} = req.params
        const post = await Post.findById(id) 
        if(!post){
            return res.status(404).json({msg:'Post not found'})
        }
        const comment = post.comments.find(comment=>comment.id === commentId)
        if(!comment){
            return res.status(404).json({msg:`Comment doesn't exists`})
        }
        if(req.user.id!==post.user.toString()&&req.user.id!==comment.user.toString()){
            return res.status(401).json({msg:"User not authorized"})
        }
        const removeIdx = post.comments.map(comment=>comment.id).indexOf(commentId)
        post.comments.splice(removeIdx,1)
        await post.save()
        res.json(post.comments)
    }catch(err){
        if(err.kind=="ObjectId"){
            return res.status(404).json({msg:'Post not found'})
        }
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})
module.exports = router