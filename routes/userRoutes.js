// CURRENTLY NOT IN USE

const express = require('express');
const router = express.Router({ mergeParams: true });

router.post('/', async (res, req) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

router.get('/', async (res, req) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

module.exports = router;