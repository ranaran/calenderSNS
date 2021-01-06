var express = require('express');
var router = express.Router();
const authenticationEnsurer = require('./authentication-ensurer');
const Event = require('../models/event');
const User = require('../models/user');
const Follow = require('../models/follow');


router.get('/:username', (req, res, next) => {
  const title = req.params.username + 'のカレンダー';
  User.findOne({
    where: {
      username: req.params.username
    }
  }).then((user) => {
    if (user) {
      Event.findAll({
        include: [
          {
            model:User,
            attributes: ['userId', 'username'],
            where: {
              username: req.params.username
            }
          }
        ],
        order: [['eventTime', 'ASC']]
      }).then((events) => {
        if (req.isAuthenticated()) {
          Follow.findOne({
            where: {
              follow: req.user.id,
              followed: user.userId
            }
          }).then((fol) => {
            if (fol) {
              res.render('user', {
                title: title,
                events: events,
                isFollowed: 1,
                isAuthenticated: 1,
                viewuser: req.user,
                eventuser: user.userId
              })
            } else {
              res.render('user', {
                title: title,
                events: events,
                isFollowed: 0,
                isAuthenticated: 1,
                viewuser: req.user,
                eventuser: user.userId
              })
            }
          })
        } else {
        res.render('user',{
          title: title,
          events: events,
          isFollowed: 0,
          isAuthenticated: 0,
          viewuser: req.user,
          eventuser: user.userId
        });
        }
      });
    } else {
      const err = new Error('指定されたユーザーは見つかりませんでした');
      err.status = 404;
      next(err);
    }
  });
});

router.post('/:eventuser/follow/:viewuser', authenticationEnsurer, (req, res, next) => {
  const eventuser = req.params.eventuser;
  const viewuser = req.params.viewuser;
  let isFollowed = req.body.isFollowed;
  isFollowed = isFollowed ? parseInt(isFollowed) : 0;
  Follow.upsert({
    follow: viewuser,
    followed: eventuser
  }).then(() => {
    res.json({ status: 'OK', isFollowed: isFollowed});
//    res.redirect('/' + eventuser);
  })
});

router.post('/:eventuser/unfollow/:viewuser', authenticationEnsurer, (req, res, next) => {
  const eventuser = req.params.eventuser;
  const viewuser = req.params.viewuser;
  let isFollowed = req.body.isFollowed;
  isFollowed = isFollowed ? parseInt(isFollowed) : 0;
  Follow.destroy({
    where: {
      follow: viewuser,
      followed: eventuser
    }
  }).then(() => {
    res.json({ status: 'OK', isFollowed: isFollowed});
//    res.redirect('/' + eventuser);
  })
});

/*
router.post('/:username/follow', authenticationEnsurer, (req, res, next) => {
  const eventId = uuid.v4();
  const updatedAt = new Date();
  const eventTime = new Date(req.body.eventtime);
  Event.create({
    eventId: eventId,
    eventName: req.body.eventname.slice(0,255) || '名称未設定',
    eventPlace: req.body.eventplace.slice(0,255) || '場所未設定',
    eventTime: eventTime,
    eventDesc: req.body.eventdesc,
    createdBy: req.user.id,
    updatedAt: updatedAt
  });
  res.redirect('/events/' + eventId);
});
*/

module.exports = router;
