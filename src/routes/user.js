const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SEND_GRID_API_KEY);

const auth = require('../middleware/auth');
const avatar = require('../utils/avatar');
const User = require('../models/user');
const router = new express.Router();

router.post('/profile/register', async (req, res) => {
  const image = await avatar(req.query.email);
  const userWithImage = {
    ...req.query,
    avatar: {
      png: image,
    },
  };

  const user = new User(userWithImage);

  const msg = {
    to: user.email,
    from: process.env.SEND_GRID_EMAIL,
    templateId: process.env.SEND_GRID_REGISTER_TEMPLATE_ID,
  };

  try {
    const token = await user.generateAuthToken();
    console.log({ user, token });
    await user.save();
    await sgMail.send(msg);
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post('/profile/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.query.email,
      req.query.password
    );
    const token = await user.generateAuthToken();

    res.send({ user, token });
  } catch (error) {
    res.status(400).send();
  }
});

router.post('/profile/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(
      (token) => token.token !== req.token
    );
    await req.user.save();

    res.send();
  } catch (error) {
    res.status(500).send();
  }
});

router.post('/profile/logoutAll', auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();

    res.send();
  } catch (error) {
    res.status(500).send();
  }
});

router.get('/profile', auth, async (req, res) => {
  res.send(req.user);
});

router.patch('/profile', auth, async (req, res) => {
  const updates = Object.keys(req.query);

  try {
    updates.forEach((update) => (req.user[update] = req.query[update]));
    await req.user.save();

    res.send(req.user);
  } catch (error) {
    res.status(500).send();
  }
});

router.delete('/profile', auth, async (req, res) => {
  const msg = {
    to: req.user.email,
    from: process.env.SEND_GRID_EMAIL,
    templateId: process.env.SEND_GRID_DELETE_TEMPLATE_ID,
  };

  try {
    await req.user.remove();
    await sgMail.send(msg);
    res.send(req.user);
  } catch (error) {
    res.status(500).send();
  }
});

const upload = multer({
  limits: { fileSize: 2000000 },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('Please upload an image'));
    }
    cb(undefined, true);
  },
});

router.post(
  '/profile/avatar',
  auth,
  upload.single('avatar'),
  async (req, res) => {
    try {
      const png = await sharp(req.file.buffer)
        .resize({ width: 400, height: 400 })
        .png()
        .toBuffer();

      const webp = await sharp(req.file.buffer)
        .resize({ width: 400, height: 400 })
        .webp()
        .toBuffer();

      req.user.avatar = { png, webp };
      await req.user.save();
      res.send(req.user);
    } catch (error) {
      res.send(error);
    }
  },
  // it has to be (error, req, res, next) so express would understand the error
  // callback to catch errors
  (error, req, res, next) => {
    res.status(400).send({ Error: error.message });
  }
);

router.delete('/profile/avatar', auth, async (req, res) => {
  req.user.avatar = undefined;
  await req.user.save();
  res.send();
});

router.get('/profile/:id/avatar', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user || !user.avatar) {
      throw new Error();
    }

    res.send(user.avatar);
  } catch (error) {
    res.status(404).send();
  }
});

module.exports = router;
