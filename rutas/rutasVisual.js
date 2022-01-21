const express = require('express');
const controlsViews = require('../controls/controlsViews');
const auth = require('./../controls/controlsAutenticacion');

const router = express.Router();

//Se usa este middleware para todos los demás
router.use(auth.userLoogedIn);

router.get('/', (req, res) => {
  res.status(200).render('frontpage', {
    title: 'Home',
  });
});

router.get('/overview', controlsViews.allOverview);
router.get('/sendero/:slug', controlsViews.senderoOverview);
router.get('/login', controlsViews.userLogin);

router.get('/registro', controlsViews.registerUser);

module.exports = router;