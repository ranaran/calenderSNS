var express = require('express');
var router = express.Router();
const Event = require('../models/event');

/* GET home page. */
router.get('/', function(req, res, next) {
  const title = 'あなたのカレンダー';
  if (req.user) {
    Event.findAll({
      where: {
        createdBy: req.user.id
      },
      order: [['eventTime', 'ASC']]
    }).then(events => {
      res.render('index', {
        title: title,
        user: req.user,
        events: events
      });
    });
  } else {
    res.render('index', { title: title, user: req.user });
  }
});

module.exports = router;
