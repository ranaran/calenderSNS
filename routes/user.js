var express = require('express');
var router = express.Router();
const authenticationEnsurer = require('./authentication-ensurer');
const Event = require('../models/event');
const User = require('../models/user');
const Follow = require('../models/follow');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const moment = require('moment-timezone');

router.get('/:username/following', (req, res, next) => {
  const title = req.params.username;
  User.findOne({
    where: {
      username: req.params.username
    }
  }).then((user) => {
    if (user) {
      Follow.count({
        where: {
          follow: user.userId
        }
      }).then((followCount) => {
        Follow.count({
          where: {
            followed: user.userId
          }
        }).then((followedCount) => {
          Follow.findAll({
            where: {
              follow: user.userId,
              followed: {
                [Op.ne]: user.userId
              }
            }
          }).then((followings) => {
            if(req.isAuthenticated()) {
              Follow.findOne({
                where: {
                  follow: req.user.id,
                  followed: user.userId
                }
              }).then((fol) => {
                if (fol) {
                  res.render('user_following', {
                    title: title,
                    followings: followings,
                    isFollowed: 1,
                    isAuthenticated: 1,
                    user: req.user,
                    eventuser: user,
                    followCount: followCount-1,
                    followedCount: followedCount-1
                  })
                } else {
                  res.render('user_following', {
                    title: title,
                    followings: followings,
                    isFollowed: 0,
                    isAuthenticated: 1,
                    user: req.user,
                    eventuser: user,
                    followCount: followCount-1,
                    followedCount: followedCount-1
                  })
                }
              });
            } else {
              res.render('user_following', {
                title: title,
                followings: followings,
                isFollowed: 0,
                isAuthenticated: 0,
                user: req.user,
                eventuser: user,
                followCount: followCount-1,
                followedCount: followedCount-1
              })
            }
          });
        })
      })
    } else {
      const err = new Error('指定されたユーザーは見つかりませんでした');
      err.status = 404;
      next(err);
    }
  });
});

router.get('/:username/followers', (req, res, next) => {
  const title = req.params.username;
  User.findOne({
    where: {
      username: req.params.username
    }
  }).then((user) => {
    if (user) {
      Follow.count({
        where: {
          follow: user.userId
        }
      }).then((followCount) => {
        Follow.count({
          where: {
            followed: user.userId
          }
        }).then((followedCount) => {
          Follow.findAll({
            where: {
              followed: user.userId,
              follow: {
                [Op.ne]: user.userId
              } 
            }
          }).then((followers) => {
            if(req.isAuthenticated()) {
              Follow.findOne({
                where: {
                  follow: req.user.id,
                  followed: user.userId
                }
              }).then((fol) => {
                if (fol) {
                  res.render('user_followers', {
                    title: title,
                    followers: followers,
                    isFollowed: 1,
                    isAuthenticated: 1,
                    user: req.user,
                    eventuser: user,
                    followCount: followCount-1,
                    followedCount: followedCount-1
                  })
                } else {
                  res.render('user_followers', {
                    title: title,
                    followers: followers,
                    isFollowed: 0,
                    isAuthenticated: 1,
                    user: req.user,
                    eventuser: user,
                    followCount: followCount-1,
                    followedCount: followedCount-1
                  })
                }
              });
            } else {
              res.render('user_followers', {
                title: title,
                followers: followers,
                isFollowed: 0,
                isAuthenticated: 0,
                user: req.user,
                eventuser: user,
                followCount: followCount-1,
                followedCount: followedCount-1
              })
            }
          });
        })
      })
    } else {
      const err = new Error('指定されたユーザーは見つかりませんでした');
      err.status = 404;
      next(err);
    }
  });
});

router.get('/:username', (req, res, next) => {
  const title = req.params.username;
  User.findOne({
    where: {
      username: req.params.username
    }
  }).then((user) => {
    if (user) {
      Follow.count({
        where: {
          follow: user.userId
        }
      }).then((followCount) => {
        Follow.count({
          where: {
            followed: user.userId
          }
        }).then((followedCount) => {
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
            events.forEach((event) => {
              event.formattedEventTime = moment(event.eventTime).tz('Asia/Tokyo').format('YYYY/MM/DD HH:mm');
            });
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
                    user: req.user,
                    eventuser: user,
                    followCount: followCount-1,
                    followedCount: followedCount-1
                  })                  
                } else {
                  res.render('user', {
                    title: title,
                    events: events,
                    isFollowed: 0,
                    isAuthenticated: 1,
                    user: req.user,
                    eventuser: user,
                    followCount: followCount-1,
                    followedCount: followedCount-1
                  })
                }
              });
            } else {
              res.render('user', {
                title: title,
                events: events,
                isFollowed: 0,
                isAuthenticated: 0,
                user: req.user,
                eventuser: user,
                followCount: followCount-1,
                followedCount: followedCount-1
              });              
            }
          });
        });
      });
    } else {
      const err = new Error('指定されたユーザーは見つかりませんでした');
      err.status = 404;
      next(err);      
    }
  });
});

/*
router.get('/:username', (req, res, next) => {
  const title = req.params.username;
  User.findOne({
    where: {
      username: req.params.username
    }
  }).then((user) => {
    Follow.count({
      where: {
        follow: user.userId
      }
    }).then((followCount) => {
      Follow.count({
        where: {
          followed: user.userId
        }
      }).then((followedCount) => {
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
                    user: req.user,
                    eventuser: user,
                    followCount: followCount-1,
                    followedCount: followedCount-1
                  })
                } else {
                  res.render('user', {
                    title: title,
                    events: events,
                    isFollowed: 0,
                    isAuthenticated: 1,
                    user: req.user,
                    eventuser: user,
                    followCount: followCount-1,
                    followedCount: followedCount-1
                  })
                }
              })
            } else {
            res.render('user',{
              title: title,
              events: events,
              isFollowed: 0,
              isAuthenticated: 0,
              user: req.user,
              eventuser: user,
              followCount: followCount-1,
              followedCount: followedCount-1
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
  });
});
*/

router.post('/:eventuser/follow/:viewuser', authenticationEnsurer, (req, res, next) => {
  const eventuser = req.params.eventuser;
  const viewuser = req.params.viewuser;
  let isFollowed = req.body.isFollowed;
  isFollowed = isFollowed ? parseInt(isFollowed) : 0;
  User.findOne({
    where: {
      userId: eventuser 
    }
  }).then((eventusername) => {
    User.findOne({
      where: {
        userId: viewuser
      }
    }).then((viewusername) => {
      Follow.upsert({
        follow: viewuser,
        followed: eventuser,
        followname: viewusername.username,
        followedname: eventusername.username 
      }).then(() => {
        res.json({ status: 'OK', isFollowed: isFollowed });
      });
    });
  });
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
