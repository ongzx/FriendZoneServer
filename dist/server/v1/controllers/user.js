'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _models = require('../models');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _async = require('async');

var _async2 = _interopRequireDefault(_async);

var _waterfall = require('async/waterfall');

var _waterfall2 = _interopRequireDefault(_waterfall);

var _series = require('async/series');

var _series2 = _interopRequireDefault(_series);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function list(req, res, next) {
    _models.User.findAll().then(function (users) {
        return res.json(users);
    }).catch(function (error) {
        return res.json(error);
    });
}

function extractEmails(text) {
    return text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
}

/**
 * Find friends based on email
 * 
 */

function findFriends(req, res, next) {
    var email = req.body.email;
    var currentUuid = "";

    _async2.default.waterfall([function (callback) {
        _models.User.findOne({
            where: {
                email: email
            }
        }).then(function (user) {
            callback(null, user);
        }).catch(function (err) {
            callback("err", { message: 'User not found' });
        });
    }, function (user, callback) {

        currentUuid = user.uuid;

        _models.Friendship.findAll({
            where: {
                $or: [{ userUuid: { like: '%' + user.uuid + '%' } }, { friendUuid: { like: '%' + user.uuid + '%' } }],
                status: 'Accepted'
            }
        }).then(function (friends) {
            callback(null, friends);
        });
    }, function (friends, callback) {
        var friendUuid = _lodash2.default.map(friends, 'friendUuid');
        var userUuid = _lodash2.default.map(friends, 'userUuid');
        var combinedUuid = _lodash2.default.concat(friendUuid, userUuid);
        var combinedUuidExcludedSelf = _lodash2.default.remove(combinedUuid, function (elem) {
            return elem !== currentUuid;
        });

        _models.User.findAll({
            where: {
                uuid: {
                    $in: combinedUuidExcludedSelf
                }
            }
        }).then(function (users) {
            callback(null, _lodash2.default.map(users, 'email'));
        });
    }], function (err, results) {
        if (err) {
            return res.send({
                success: false,
                err: err
            });
        }
        return res.send({
            success: true,
            friends: results,
            count: results.length
        });
    });
}

function addFriend(req, res, next) {

    var friendsEmail = req.body.friends;

    _models.User.findAll({
        where: {
            email: {
                $in: friendsEmail
            }
        }
    }).then(function (user) {

        _models.Friendship.findOrCreate({
            where: {
                $or: [{
                    userUuid: {
                        $in: _lodash2.default.map(user, 'uuid')
                    }
                }, {
                    friendUuid: {
                        $in: _lodash2.default.map(user, 'uuid')
                    }
                }]
                // status: {
                //     $notLike: '%Blocked'
                // }
            },
            defaults: {
                userUuid: user[0].uuid,
                friendUuid: user[1].uuid,
                following: true,
                status: 'Accepted'
            }
        }).then(function (friendship) {

            if (friendship) {

                if (friendship[0].status === 'Blocked') {
                    return res.send({
                        success: false,
                        message: 'User blocked'
                    });
                }

                friendship[0].update({
                    status: 'Accepted'
                }).then(function (result) {
                    return res.send({
                        success: true
                    });
                });
            } else {
                return res.send({
                    success: true,
                    message: 'Friends added'
                });
            }
        }).catch(function (err) {
            return res.send({
                success: false,
                message: 'error finding friendship'
            });
        });
    }).catch(function (err) {
        return res.send({
            success: false,
            message: 'Users does not exist'
        });
    });
}

function commonFriends(req, res, next) {

    var friend = req.body.friends;

    _models.User.findAll({
        where: {
            email: {
                $in: friend
            }
        }
    }).then(function (user) {

        _async2.default.waterfall([function (callback) {
            user[0].getFriend().then(function (friends) {
                callback(null, friends);
            });
        }, function (user1Friends, callback) {
            user[1].getFriend().then(function (user2Friends) {
                callback(null, _lodash2.default.intersectionBy(user1Friends, user2Friends, 'uuid'));
            });
        }], function (err, results) {

            var friends = _lodash2.default.filter(results, function (friend) {
                return friend.Friendship.status === 'Accepted';
            });

            return res.send({
                success: true,
                friends: _lodash2.default.map(friends, 'email'),
                count: friends.length
            });
        });
    }).catch(function (err) {
        return res.send({
            success: false,
            message: 'Users not exist'
        });
    });
}

/**
 * possible error, requester not found / target not found
 */

function subscribe(req, res, next) {
    var requestor = req.body.requestor;
    var target = req.body.target;

    _models.User.findOne({
        where: {
            email: requestor
        }
    }).then(function (requestor) {

        _models.User.findOne({
            where: {
                email: target
            }
        }).then(function (target) {

            _models.Friendship.findOrCreate({
                where: {
                    userUuid: requestor.uuid,
                    friendUuid: target.uuid
                },
                defaults: {
                    following: true,
                    status: 'Pending'
                }
            }).then(function (friendship) {

                if (friendship) {
                    friendship[0].update({
                        following: true
                    }).then(function (result) {
                        return res.send({
                            success: true
                        });
                    }).catch(function (err) {
                        return res.send({
                            success: false,
                            message: 'Friendship does not exist'
                        });
                    });
                } else {
                    return res.send({
                        success: true
                    });
                }
            });
        }).catch(function (err) {
            return res.send({
                success: false,
                message: 'Target does not exist'
            });
        });
    }).catch(function (err) {
        return res.send({
            success: false,
            message: 'Requestor does not exist'
        });
    });
}

function blockUser(req, res, next) {

    var requestor = req.body.requestor;
    var target = req.body.target;

    _models.User.findOne({
        where: {
            email: requestor
        }
    }).then(function (requestor) {

        _models.User.findOne({
            where: {
                email: target
            }
        }).then(function (target) {

            _models.Friendship.findOrCreate({
                where: {
                    $or: [{
                        userUuid: {
                            $in: [requestor.uuid, target.uuid]
                        }
                    }, {
                        friendUuid: {
                            $in: [requestor.uuid, target.uuid]
                        }
                    }]
                },
                defaults: {
                    following: false,
                    status: 'Blocked'
                }
            }).then(function (friendship) {

                if (friendship) {
                    friendship[0].update({
                        following: false,
                        status: friendship[0].status === 'Accepted' ? 'Accepted' : 'Blocked'
                    }).then(function (result) {
                        return res.send({
                            success: true
                        });
                    }).catch(function (err) {
                        return res.send({
                            success: false,
                            message: 'Friendship does not exist'
                        });
                    });
                } else {
                    return res.send({
                        success: true
                    });
                }
            });
        }).catch(function (err) {
            return res.send({
                success: false,
                message: 'Target does not exist'
            });
        });
    }).catch(function (err) {
        return res.send({
            success: false,
            message: 'Requestor does not exist'
        });
    });
}

function findRecipients(req, res, next) {

    var sender = req.body.sender;
    var mentionedEmail = extractEmails(req.body.text);
    var senderUuid = "";

    _models.User.findOne({
        where: {
            email: sender
        }
    }).then(function (sender) {

        senderUuid = sender.uuid;

        _models.Friendship.findAll({
            where: {
                $or: [{ userUuid: { like: '%' + sender.uuid + '%' } }, { friendUuid: { like: '%' + sender.uuid + '%' } }],
                status: {
                    $notLike: 'Blocked'
                },
                following: true
            }
        }).then(function (recipients) {

            var friendUuid = _lodash2.default.map(recipients, 'friendUuid');
            var userUuid = _lodash2.default.map(recipients, 'userUuid');
            var combinedUuid = _lodash2.default.concat(friendUuid, userUuid);
            var combinedUuidExcludedSelf = _lodash2.default.remove(combinedUuid, function (elem) {
                return elem !== senderUuid;
            });

            _models.User.findAll({
                where: {
                    uuid: {
                        $in: combinedUuidExcludedSelf
                    }
                }
            }).then(function (result) {
                return res.send({
                    success: true,
                    recipients: _lodash2.default.map(result, 'email'),
                    count: result.length,
                    mentionedEmail: mentionedEmail
                });
            });
        }).catch(function (err) {
            return res.send({
                success: false,
                message: 'Recipients does not exist'
            });
        });
    }).catch(function (err) {
        return res.send({
            success: false,
            message: 'Sender does not exist'
        });
    });
}

exports.default = {
    list: list,
    addFriend: addFriend,
    findFriends: findFriends,
    commonFriends: commonFriends,
    subscribe: subscribe,
    blockUser: blockUser,
    findRecipients: findRecipients
};
module.exports = exports['default'];
//# sourceMappingURL=user.js.map
