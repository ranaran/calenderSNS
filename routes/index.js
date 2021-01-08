var express = require('express');
var router = express.Router();
const authenticationEnsurer = require('./authentication-ensurer');
const Event = require('../models/event');
const User = require('../models/user');
const Follow = require('../models/follow');
const moment = require('moment-timezone');

/* GET home page. */
router.get('/', function(req, res, next) {
  const title = 'あなたのカレンダー';
  if (req.user) {
    Event.findAll({
      include: [
        {
          model: User,
          attributes: ['userId'],
          required: true,
          include: [
            {
              model: Follow,
              where: {
                follow: req.user.id
              },
              required: true,
            }
          ]
        }
      ],
      order: [['eventTime', 'ASC']]
    }).then(events => {
      events.forEach((event) => {
        event.formattedEventTime = moment(event.eventTime).tz('Asia/Tokyo').format('YYYY/MM/DD HH:mm');
      });
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

/*
router.get('/:userName', authenticationEnsurer, (req, res, next) => {
  const title = req.params.userId + 'のカレンダー';
  User.findOne({
    where: {
      userName: req.params.userName
    }
  }).then((user) => {
    if (user) {
      Event.findAll({
        include: [
          {
            model:User,
            attributes: ['userId', 'userName']
          }
        ],
        where: {
          userName: req.params.userName
        },
        order: [['eventTime', 'ASC']]
      }).then((events) => {
        req.render('user',{
          title: title,
          events: events
        });
      });
    } else {
      const err = new Error('指定されたユーザーは見つかりませんでした');
      err.status = 404;
      next(err);
    }
  });
});
*/

module.exports = router;
