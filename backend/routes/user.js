const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const jwt = require('jsonwebtoken');
const sendSms = require('../middleware/sms-login');

const User = require('../models/user');



router.post('/signup',sendSms,(req,res,next) =>{
    bcrypt.hash(req.body.password,10,)
    .then(hash =>{
        const user = new User({
            email:req.body.email,
            password:hash
            
        });
        user.save()
        .then(result =>{
            res.status(201).json({
                message:'User Created',
                result:result
            });
        })
        .catch(err =>{
            res.status(500).json({
              message:'Invalid email ! Email kani Hore Ayu u jirey'
            });
        });
    });
   
});

router.post('/login', (req,res,next) =>{
    let fetchedUser;
    User.findOne({email:req.body.email}).then (user =>{
        if(!user){
            return res.status(401).json ({
                message:'Email Address ka waa Khalad'
            });

        }
        fetchedUser = user;
        return bcrypt.compare(req.body.password, user.password);
    })
    .then (result =>{
            if(!result){
                return res.status(401).json({
                    message: 'Password ku waa Qalad'
                });
      
            }
            
       
            const token = jwt.sign({email:fetchedUser.email,userId:fetchedUser._id},
                'screte_this_should_be_longer',
                {expiresIn: '1h'}
                );
                res.status(200).json({
                    token:token,
                    email : fetchedUser.email,
                    expiresIn : 3600
                });
                const state = true;
                
                User.updateOne({email:fetchedUser.email},state).then(result =>{
                    console.log(result);
                    if (result.nModified >0 ){
                      
                      res.status(200).json({message:"Update Successful"});
                    }
                   else{
                     res.status(401).json({message:'Not Authorized'});
                   }
                  
                  });
               
// update eng here                
                
    })
    .catch (err =>{
        return res.status(401).json ({
            message:'Auth  Failed Email And Password Are Wrong'
        });
    });
})

module.exports = router;