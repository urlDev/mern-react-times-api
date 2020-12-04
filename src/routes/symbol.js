const express = require('express');
const router = new express.Router();
const Symbol = require('../models/symbol');

router.post('/', async(req, res) => {
    const symbol = new Symbol(req.body);
    try {
        await symbol.save();
        res.status(201).send(symbol);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get('/:id', async(req, res) => {
    const _id = req.params.id;

    try {
        const symbol = await Symbol.findById(_id);

        if (!symbol) {
            return res.status(404).send();
        }

        res.send(symbol);
    } catch (error) {
        res.status(500).send();
    }
});

router.get('/', async(req, res) => {
    try {
        const symbols = await Symbol.find();

        res.send(symbols);
    } catch (error) {
        res.status(500).send();
    }
});

router.delete('/:id', async(req, res) => {
    try {
        const symbol = await Symbol.findByIdAndDelete(req.params.id);

        if (!symbol) {
            return res.status(404).send();
        }

        res.send(symbol);
    } catch (error) {
        res.status(500).send();
    }
});

module.exports = router;