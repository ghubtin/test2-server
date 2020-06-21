const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    console.log(req);
    res.send('(from routes/router.js) server is up and running');
});

module.exports = router;
