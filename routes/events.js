'use strict';
const express = require('express');
const router = express.Router();
const authenticationEnsurer = require('./authentication-ensurer');
const uuid = require('uuid');
const Event = require('../models/event');
const User = require('../models/user');

router.get('/new', authenticationEnsurer, (req, res, next) => {
  res.render('new', { user: req.user });
});

router.post('/', authenticationEnsurer, (req, res, next) => {
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

router.get('/:eventId', (req, res, next) => {
  Event.findOne({
    include: [
      {
        model: User,
        attributes: ['userId', 'username']
      }
    ],
    where: {
      eventId: req.params.eventId
    },
    order: [['eventTime', 'ASC']]
  }).then((event) => {
    if (event) {
      res.render('event', {
        event: event
      });
    } else {
      const err = new Error('指定されたイベントは見つかりませんでした');
      err.status = 404;
      next(err);
    }
  });
});

module.exports = router;