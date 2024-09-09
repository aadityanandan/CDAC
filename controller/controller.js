const express = require('express');

const defaultController = (req, res) => {
res.render('index', { title: 'My EJS App'})
});

module.exports = defaultController; 
    
