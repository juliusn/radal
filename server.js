const dotenv = require('dotenv');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const result = dotenv.config();
if (result.error) throw result.error;

mongoose.connect(
    `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/cat`).
    then(() => {
      console.log('Connected successfully.');
      app.listen(3000);
    }, (err) => {
      console.log(err.message);
    });
