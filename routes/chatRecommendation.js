const express = require('express');
const router = express.Router();

const {
  chatRecommedation
} = require('../controllers/chatRecommendationController');

router.post('/', chatRecommedation);

module.exports = router;
