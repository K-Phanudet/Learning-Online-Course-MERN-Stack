const express = require('express')
const router = express.Router()
const {check,validationResult} = require('express-validator')
const User = require('../../models/Users')
const gravatar = require('gravatar')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
// @route POST /api/users
// @desc  Test Users
// @access Public
router.post('/',[
    check('name','name is require').notEmpty(),
    check('email','Please include a valid email').isEmail(),
    check('password','Please enter password with 6 or more characters').isLength({min:6})
],async (req,res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    const {name,email,password} = req.body
    // user exist
    let user = await User.findOne({email})
    if(user){
        return res.status(400).json({errors:[{msg:"User already exists"}]})
    }
    try{
        // get user avatar
        let avatar =  gravatar.url(email,{
            s:'200',
            r:'pg',
            d:'mm'
        })
        // create user model
        user = new User({
            name,
            email,
            password,
            avatar
        })
        // encrypt password
        const salt =  await bcryptjs.genSalt(10)
        user.password =  await bcryptjs.hash(password,salt)
        // save user
        await user.save()

        //sign jwt
        let payload = {user:{id:user.id}}
        jwt.sign(payload,
            config.get('privateKey'),
            {expiresIn:3600*5,
            algorithm:'RS256'},
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