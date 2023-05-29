const express = require('express');
const multer = require('multer');
const revenueController = require('../controllers/fileRecommendationController');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post(
  '/',
  upload.single('file'),
  revenueController.generateFileRecommendation
);

module.exports = router;
