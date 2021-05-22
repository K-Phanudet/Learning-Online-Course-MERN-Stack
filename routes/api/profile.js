const express = require('express')
const router = express.Router()
const {verifyToken} = require('../../middleware/auth')
const Profile = require('../../models/Profile')
const User = require('../../models/Users')
const {check,validationResult} = require('express-validator')
// @route GET /api/profile/
// @desc  Get user profile by send token
// @access Private
router.get('/',verifyToken,async (req,res)=>{
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
})
module.exports = router