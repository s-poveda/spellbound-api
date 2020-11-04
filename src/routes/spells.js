const express = require('express');
const SpellsService = require('../services/SpellsService');

const router = express.Router();

router.route('/')
  // .all()
  .get((req, res, next) => {
    SpellsService.getAllSpells(req.app.get('db'))
    .then( data =>{
      res.json(data);
    });
  })
  .post((req, res, next) => {
    res.send(201, 'posted spell');
  })

router.route('/:spellId')
.get((req, res, next) => {
  res.send(200, 'got specific spell');
})

module.exports = router;
