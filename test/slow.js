/*jshint esversion:6, node:true */
// a simple server that serves a JSON file with a delay

const express = require('express');
const path = require('path');

const app = express();
const delay = process.argv[2] || 500;
const filePath = path.join(__dirname, '..', 'package.json');

app.get('/', (req, res) => {
  setTimeout(() => {
    res.sendFile(filePath);
  }, delay);
});

app.listen(3000, function() {
  console.log('Ready at http://localhost:3000');
});
