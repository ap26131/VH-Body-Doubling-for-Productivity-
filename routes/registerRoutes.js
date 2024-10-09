// CURRENTLY NOT IN USE

const express = require('express');
const router = express.Router({ mergeParams: true });
const formController = require('../controllers/formController');

router.get('/register', async (req, res) =>{
    res.sendFile(path.join(__dirname, 'public', 'registration.html'));
});

router.post('/register',  formController.createUser);

module.exports = router;