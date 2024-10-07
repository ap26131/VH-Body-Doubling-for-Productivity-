const express = require('express');
const router = express.Router();
const formController = require('../controllers/formController');

router.post('/', formController.createUser);

router.get('/', async (res, req) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

module.exports = router;