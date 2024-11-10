const express = require('express');
const { Schema } = require('mongoose');
const User = require('../models/User');
const { body, validationResult, header } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser.js');
const JWT_SECRET = "Rahilisthebest";

const router = express.Router();

// Route 1: create user
router.post('/createuser', [
    body('password', 'Enter a valid password').isLength({ min: 5 }),
    body('email', 'Enter a valid email').isEmail(),
    body('name', 'Enter a valid name').isLength({ min: 3 })
], async (req, res) => {
    let success = false;
    const result = validationResult(req);
    console.log(result);
    if (!result.isEmpty()) {
        return res.status(400).json({ error: result.array() , success});
    }
    try {
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ error: "Sorry a user with this email already exists", success});
        }
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password,salt);
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass
        });

        const data = {
            user:{
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET);
        console.log(authToken);
        success = true;
        res.json({authToken, success});
    } catch (error) {
        console.log(error.message);
        res.status(500).send({error : "Something went wrong", success});
    }
})


// Route 2: login user
router.post('/login', [
    body('password', 'Password can\'t be empty').exists(),
    body('email', 'Enter a valid email').isEmail()
], async (req, res) => {
    
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array() });
    }

    const {email,password} = req.body;
    let success = true;
    try {
        let user = await User.findOne({email});
        
        if (!user) {
            success = false;
            return res.status(400).json({error: "Please try to login with correct credentials!"});
        }

        const passwordCompare = await bcrypt.compare(password,user.password);

        if (!passwordCompare) {
            success = false;
            return res.status(400).json({error: "Please try to login with correct credentials!"});
        }

        const data = {
            user:{
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET);
        res.json({success, authToken});
    } catch (error) {
        console.log(error.message);
        res.status(500).send({error: "Internal server error"});
    }
    
})


// Route 3: get user details
// Route 2: login user
router.post('/getuser', fetchuser, async (req, res) => {

    try {
        userId = req.user.id;
        data = await User.findById(userId).select("-password");
        return res.json({data});
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal server error");
    }
    
})

module.exports = router