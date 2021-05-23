const express = require('express')
const router = express.Router()
const {verifyToken} = require('../../middleware/auth')
const Profile = require('../../models/Profile')
const User = require('../../models/Users')
const {check,validationResult} = require('express-validator')
const {assignObjectNotNullToBaseObject} = require('../../utils/helpService')
const request = require('request')
const config = require('config')
// @route GET /api/profile/me
// @desc  Get user profile by send token
// @access Private
router.get('/me',verifyToken,async (req,res)=>{
    try{
        const profile = await Profile.findOne({user:req.user.id}).populate('user',['user,avatar'])
        if(!profile){
            return res.status(400).json({msg:'There is no profile for this user'})
        }
        res.status(200).json(profile)
    }catch(err){
        console.error(err.message)
        res.status(500).send('Server error')
    }
})


// @route POST /api/profile/
// @desc  Create or Update profile
// @access Private
router.post('/',[
    verifyToken,[
        check('status','Status is require').notEmpty(),
        check('skills','skills are require').notEmpty()
    ]
],async (req,res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    let{
        company,website,location,bio,status,skills,githubusername,youtube,facebook,twitter,instagram,linkedin
    } = req.body

    const profileField = {}
    profileField.user = req.user.id
    if(skills){skills = skills.split(', ').map(val=>val.trim())}
    assignObjectNotNullToBaseObject(profileField,{company,website,location,bio,status,skills,githubusername})
    assignObjectNotNullToBaseObject(profileField.social= {...profileField.social},{youtube,facebook,twitter,instagram,linkedin})
    const filter = {user:req.user.id}
    let profile = await Profile.findOne(filter)
    try{
        if(profile){
        // Update 
        profile = await Profile.findOneAndUpdate(filter,{$set:profileField},{new:true})
        return res.json(profile)
        }
        // Create
        profile = new Profile(profileField)
        await profile.save()
        res.json(profile)
    }catch(err){
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})

// @route GET /api/profile/
// @desc  Get all profile 
// @access Public
router.get('/',async (req,res)=>{
    try{
        const profile = await Profile.find().populate('user',['user,avatar'])
        res.status(200).json(profile)
    }catch(err){
        console.error(err.message)
        res.status(500).send('Server error')
    }
})

// @route GET /api/profile/user/:userId
// @desc  Get user profile by send param user_id 
// @access Public
router.get('/user/:user_id',async (req,res)=>{
    try{
        const {user_id} = req.params
        const profile = await Profile.findOne({user:user_id}).populate('user',['user,avatar'])
        if(!profile){
            return res.status(400).json({msg:"Profile not found"})
        }
        res.status(200).json(profile)
    }catch(err){
        console.error(err.message)
        if(err.kind == "ObjectId"){
            return res.status(400).json({msg:"Profile not found"})
        }
        res.status(500).send('Server error')
    }
})

// @route DELETE /api/profile/
// @desc  DELETE profile & user
// @access Private
router.delete('/',verifyToken,async (req,res)=>{
    try{
        await Profile.findOneAndDelete({user:req.user.id})
        await User.findOneAndDelete({_id:req.user.id})
        res.status(200).json({msg:"User deleted"})
    }catch(err){
        console.error(err.message)
        res.status(500).send('Server error')
    }
})

// @route PUT /api/profile/experience
// @desc  PUT user profile experience
// @access Private
router.put('/experience',[verifyToken,
[
    check('title','Title is required').notEmpty(),
    check('company','Company is required').notEmpty(),
    check('from','From date is required').notEmpty()
]
],async (req,res)=>{
    try{
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()})
        }
        const newExp = {company,title,from,to,currently,location,description } = req.body
        const profile = await Profile.findOne({user:req.user.id})
        profile.experience.unshift(newExp)
        await profile.save()
        res.json(profile)
    }catch(err){
        console.error(err.message)
        res.status(500).send('Server error')
    }
})

// @route DELETE /api/profile/experience
// @desc  DELETE user profile experience
// @access Private
router.delete('/experience/:exp_id',verifyToken,async (req,res)=>{
    try{
        const {exp_id} = req.params
        const profile = await Profile.findOne({user:req.user.id})
        const removeIdx = profile.experience.map(val=>val.id).indexOf(exp_id)
        if(removeIdx<0) return res.status(400).json({msg:`experience of id ${exp_id} not found`})
        profile.experience.splice(removeIdx,1)
        await profile.save()
        res.status(200).json(profile)
    }catch(err){
        console.error(err.message)
        res.status(500).send('Server error')
    }
})


// @route PUT /api/profile/education
// @desc  PUT user profile education
// @access Private
router.put('/education',[verifyToken,
    [
        check('school','School is required').notEmpty(),
        check('degree','Degree is required').notEmpty(),
        check('fieldofstudy','Field of study date is required').notEmpty(),
        check('from','From date is required').notEmpty(),
    ]
    ],async (req,res)=>{
        try{
            const errors = validationResult(req)
            if(!errors.isEmpty()){
                return res.status(400).json({errors:errors.array()})
            }
            const newExp = {school,degree,fieldofstudy,from,to,currently,location,description } = req.body
            const profile = await Profile.findOne({user:req.user.id})
            profile.education.unshift(newExp)
            await profile.save()
            res.json(profile)
        }catch(err){
            console.error(err.message)
            res.status(500).send('Server error')
        }
    })
    
// @route DELETE /api/profile/education
// @desc  DELETE user profile education
// @access Private
router.delete('/education/:edu_id',verifyToken,async (req,res)=>{
    try{
        const {edu_id} = req.params
        const profile = await Profile.findOne({user:req.user.id})
        const removeIdx = profile.education.map(val=>val.id).indexOf(edu_id)
        if(removeIdx<0) return res.status(400).json({msg:`education of id ${edu_id} not found`})
        profile.education.splice(removeIdx,1)
        await profile.save()
        res.status(200).json(profile)
    }catch(err){
        console.error(err.message)
        res.status(500).send('Server error')
    }
})

// @route GET /api/profile/github/:username
// @desc  GET user repos from github
// @access Public
router.get('/github/:username',(req,res)=>{
    try{
        const options = {
            uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=create:asc&client_id=${config.get('githubClientId')}&
            client_secret=${config.get('githubSecretId')}`,
            method:'get',
            headers:{'user-agent':'node.js'}
        }
        request(options,(err,response,body)=>{
            if(err)throw err
            if(response.statusCode!==200)return res.status(404).json({msg:'No Github Profile found'})
            res.json(JSON.parse(body))
        })
    }catch(err){
        console.error(err.message)
        res.status(500).send('Server error')
    }
})
module.exports = router