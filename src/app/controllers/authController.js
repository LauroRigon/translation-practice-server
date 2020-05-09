const express = require('express');
const router = express.Router();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { User } = require('../models/user');

function generateToken(params) {
    return jwt.sign(params, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: 86400
    });
}

router.post('/register', async (req, res) => {
    const userExists = await User.findOne({ email: req.body.email });
        
    if (!!userExists) {
        return res.status(400).json({ message: 'User already exists!'})
    }
    
    try {
        const user = await User.create({
            email: req.body.email,
            password: await bcrypt.hash(req.body.password, 10),
        });
        const freshUser = await user.save();
        freshUser.password = undefined;

        res.json({ user: freshUser, token: generateToken(freshUser.toJSON()) })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {        
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(404).json({ message: 'User not found!'})
        }
        
        let passCheck = await bcrypt.compare(password, user.password);
        if (!passCheck) {
            return res.status(401).json({ message: 'Invalid password' })
        }

        user.password = undefined;

        return res.json({ user, token: generateToken(user.toJSON()) })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
});

module.exports = app => app.use('/auth', router);