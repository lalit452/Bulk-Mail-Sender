const express = require('express');
const { sendBulkEmails } = require('../controllers/mailController');
const upload = require('../utils/upload');

const router = express.Router();
router.post('/send', upload.single('csvFile'), sendBulkEmails);

module.exports = router;