const express = require('express');
const router = express.Router();


const emailValid = require('../models/validateEmail');


//post data
router.post('/' , async(req,res) =>{
    try{
        const data = req.body
        const newEmail = new emailValid(data);
        const savedEmail = await newEmail.save();
    res.status(200).send({
        message : 'saved successfully',
        success : true
    });    
    }catch(error){
        console.log(error);
        if(error.code === 11000){
            res.status(400).send({
                message : 'duplicate email',
                success : false,
                error : 'this email already exist'
            });
        }

        res.status(400).send({
            message : 'error in validation',
            success : false,
            error : error.message
        });
    }
});

//get the data
router.get('/',async(req,res) =>{
    try{
        const mail = await emailValid.find();
        res.status(200).send(
             mail
        );
    }catch(err){
        console.log(err);
        res.status(400).send({
            message : 'error in getting the emails',
            success : false,
            error 
        });
    }
})



module.exports = router;