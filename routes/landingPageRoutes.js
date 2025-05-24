
const express = require('express');
const router = express.Router();






router.get('/landing-page', (req, res) => {
      res.render('dashboard/landingPage');
    });


    

module.exports = router;










 