const express = require('express');
const router = new express.Router();
const auth = require('../middleware/auth');
const User = require('../models/user');

router.post('/profile/register', async(req, res) => {
    const user = new User(req.body);

    try {
        const token = await user.generateAuthToken();
        await user.save();
        res.status(201).send({ user, token });
    } catch (error) {
        res.status(400).send(error);
    }
});

router.post('/profile/login', async(req, res) => {
    try {
        const user = await User.findByCredentials(
            req.body.email,
            req.body.password,
        );
        const token = await user.generateAuthToken();

        res.send({ user, token });
    } catch (error) {
        res.status(400).send();
    }
});

router.post('/profile/logout', auth, async(req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(
            (token) => token.token !== req.token,
        );
        await req.user.save();

        res.send();
    } catch (error) {
        res.status(500).send();
    }
});

router.post('/profile/logoutAll', auth, async(req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();

        res.send();
    } catch (error) {
        res.status(500).send();
    }
});

router.get('/profile', auth, async(req, res) => {
    res.send(req.user);
});

router.patch('/profile', auth, async(req, res) => {
    const updates = Object.keys(req.body);

    try {
        updates.forEach((update) => (req.user[update] = req.body[update]));
        await req.user.save();

        res.send(req.user);
    } catch (error) {
        res.status(500).send();
    }
});

router.delete('/profile', auth, async(req, res) => {
    try {
        await req.user.remove();
        res.send(req.user);
    } catch (error) {
        res.status(500).send();
    }
});

module.exports = router;