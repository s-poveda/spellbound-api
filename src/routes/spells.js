const express = require('express');
// const spellsService = require('./services/spellsService');

const router = express.Router();

router.route('/')
  // .all()
  .get((req, res, next) => {
    res.send(200,'got all');
  })
  .post((req, res, next) => {
    res.send(201, 'posted spell');
  })

router.route('/:spellId')
.get((req, res, next) => {
  res.send(200, 'got specific spell');
})

module.exports = router;
