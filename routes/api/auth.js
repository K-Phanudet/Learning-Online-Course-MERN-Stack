const express = require('express')
const router = express.Router()
const {verifyToken} = require('../../middleware/auth')
const User = require('../../models/Users')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {check,validationResult} = require('express-validator')
const config = require('config') 

// @route GET /api/auth
// @desc  authentication
// @access Private
router.get('/',verifyToken,async (req,res)=>{
    try{
        let user = await User.findById(req.user.id).select('-password')
        res.status(200).json({user})
    }catch(err){
        console.error(err.message)
        res.status(500).send('Server error')
    }
});

// @route POST /api/auth
// @desc  authenticate login
// @access Public
router.post('/',[
    check('email','Please include a valid email').isEmail(),
    check('password','Password is require!').exists()
],async (req,res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    const {email,password} = req.body
    // user exist
    let user = await User.findOne({email})
    if(!user){
        return res.status(400).json({errors:[{msg:"Invalid Credential"}]})
    }
    try{
        const isMatch = await bcryptjs.compare(password,user.password)
        if(!isMatch){
            return res.status(400).json({errors:[{msg:"Invalid Credential"}]})
        }
        let payload = {user:{id:user.id}}
        jwt.sign(
            payload,
            config.get('privateKey'),
            {expiresIn:3600*5,algorithm:'RS256'},
            (err,token)=>{
            if(err) throw err
            res.status(200).json({token})
        })
    }catch(err){
        console.error(err.message)
        res.status(500).send('Server error')
    }
})


module.exports = router