const express = require('express');
const controlsViews = require('../controls/controlsViews');

const router = express.Router();

router.get('/overview', controlsViews.allOverview);
router.get('/sendero/:slug', controlsViews.senderoOverview);

module.exports = router;