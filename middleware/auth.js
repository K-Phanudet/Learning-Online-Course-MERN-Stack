const jwt = require('jsonwebtoken')
const config = require('config')

const verifyToken = (req,res,next)=>{
    const token = req.header('x-auth-token')
    if(!token){
        return res.status(401).send('No token , authorization denied')
    }
    try{
        const decoder = jwt.verify(token,config.get('publicKey'))
        req.user = decoder.user
        next()
    }catch(err){
        console.log(err)
        res.status(500).json({msg:'token is invalid!'})
    }
} 


module.exports = {verifyToken}