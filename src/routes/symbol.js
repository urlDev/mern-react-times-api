const express = require("express");
const router = new express.Router();
const Symbol = require("../models/symbol");
const auth = require("../middleware/auth");

router.post("/", auth, async (req, res) => {
  const symbol = new Symbol({
    ...req.body,
    owner: req.user._id,
  });

  try {
    await symbol.save();
    res.status(201).send(symbol);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/:id", auth, async (req, res) => {
  const _id = req.params.id;

  try {
    const symbol = await Symbol.findOne({ _id, owner: req.user._id });

    if (!symbol) {
      return res.status(404).send();
    }

    res.send(symbol);
  } catch (error) {
    res.status(500).send();
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const symbols = await Symbol.find({ owner: req.user._id });

    res.send(symbols);
  } catch (error) {
    res.status(500).send();
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const symbol = await Symbol.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!symbol) {
      return res.status(404).send();
    }

    res.send(symbol);
  } catch (error) {
    res.status(404).send();
  }
});

module.exports = router;
