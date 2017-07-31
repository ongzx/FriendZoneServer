import Promise from 'bluebird';
import { User, Friendship } from '../models';
import _ from 'lodash';
import async from 'async';
import waterfall from 'async/waterfall';
import series from 'async/series';

function list(req, res, next) {
    User.findAll().then(users => {
        return res.json(users);
    }).catch((error) => {
        return res.json(error);
    })
}

function extractEmails (text)
{
    return text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
}

/**
 * Find friends based on email
 * 
 */

function findFriends(req, res, next) {
    let email = req.body.email;
    let currentUuid = "";

    async.waterfall([
        function(callback) {
            User.findOne({
                where: {
                    email: email
                }
            })
            .then((user) => {
                callback(null, user);
            })
            .catch((err) => {
                callback("err", {message: 'User not found'});
            })
        },
        function(user, callback) {

            currentUuid = user.uuid;

            Friendship.findAll({
                where: {
                    $or: [
                        { userUuid: { like: '%' + user.uuid + '%' } },
                        { friendUuid: { like: '%' + user.uuid + '%' } }
                    ],
                    status: 'Accepted'
                }
            })
            .then((friends) => {
                callback(null, friends);
            })
        }, 
        function(friends, callback) {
            let friendUuid = _.map(friends, 'friendUuid');
            let userUuid = _.map(friends, 'userUuid');
            let combinedUuid = _.concat(friendUuid, userUuid);
            let combinedUuidExcludedSelf = _.remove(combinedUuid, (elem) => { return elem !== currentUuid } );

            User.findAll({
                where: {
                    uuid: {
                        $in: combinedUuidExcludedSelf
                    }
                }
            })
            .then((users) => {
                callback(null, _.map(users, 'email'))
            })
        }
    ], (err, results) => {
        if (err) {
            return res.send({
                success:false,
                err
            })
        }
        return res.send({
            success: true,
            friends: results,
            count: results.length
        })
    })
}


function addFriend(req, res, next) {

    let friendsEmail = req.body.friends;

    User.findAll({
        where: {
            email: {
                $in: friendsEmail
            }
        }
    })
    .then((user) => {

        Friendship.findOrCreate({
            where: {
                $or: [
                    { 
                        userUuid: { 
                            $in: _.map(user, 'uuid')
                        } 
                    },
                    { 
                        friendUuid: { 
                            $in: _.map(user, 'uuid')
                        } 
                    }
                ],
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
        }).then((friendship) => {

            if (friendship) {

                if (friendship[0].status === 'Blocked') {
                    return res.send({
                        success: false,
                        message: 'User blocked'
                    })
                }

                friendship[0].update({
                    status: 'Accepted'
                }).then((result) => {
                    return res.send({
                        success: true
                    })
                })
            } else {
                return res.send({
                    success: true,
                    message: 'Friends added'
                })
            }
            
        }).catch((err) => {
            return res.send({
                success:false,
                message: 'error finding friendship'
            })
        })

    }).catch((err) => {
        return res.send({
            success: false,
            message: 'Users does not exist'
        })
    })

   
}

function commonFriends(req, res, next) {

    let friend = req.body.friends;

    User.findAll({
        where: {
            email: {
                $in: friend
            }
        }
    }).then(function(user) {

        async.waterfall([
            function(callback) { 
                user[0].getFriend()
                    .then(function(friends) {
                        callback(null, friends);
                    })
            },
            function(user1Friends, callback) { 
                user[1].getFriend()
                    .then(function(user2Friends) {
                        callback(null, _.intersectionBy(user1Friends, user2Friends, 'uuid'));
                    })
            }
        ], function(err, results) {

            let friends = _.filter(results, (friend) => {return friend.Friendship.status === 'Accepted' } )

            return res.send({
                success: true,
                friends: _.map(friends, 'email'),
                count: friends.length
            })
        });

    }).catch((err) => {
        return res.send({
            success: false,
            message: 'Users not exist'
        })
    })
}

/**
 * possible error, requester not found / target not found
 */

function subscribe(req, res, next) {
    let requestor = req.body.requestor;
    let target = req.body.target;

    User.findOne({
        where: {
            email: requestor
        }
    }).then(function(requestor) {

        User.findOne({
            where: {
                email: target
            }
        }).then((target) => {

            Friendship.findOrCreate({
                where: {
                    userUuid: requestor.uuid,
                    friendUuid: target.uuid
                }, 
                defaults: { 
                    following: true,
                    status: 'Pending' 
                }
            }).then((friendship) => {

                if (friendship) {
                    friendship[0].update({
                        following: true
                    }).then((result) => {
                        return res.send({
                            success: true
                        })
                    }).catch((err) => {
                        return res.send({
                            success: false,
                            message: 'Friendship does not exist'
                        })
                    })
                } else {
                    return res.send({
                        success: true
                    })
                }
            })
        }).catch((err) => {
            return res.send({
                success: false,
                message: 'Target does not exist'
            })
        })
    }).catch((err) => {
        return res.send({
            success: false,
            message: 'Requestor does not exist'
        })
    })

}

function blockUser(req, res, next) {

    let requestor = req.body.requestor;
    let target = req.body.target;

    User.findOne({
        where: {
            email: requestor
        }
    }).then(function(requestor) {

        User.findOne({
            where: {
                email: target
            }
        }).then((target) => {

            Friendship.findOrCreate({
                where: {
                    $or: [
                        { 
                            userUuid: { 
                                $in: [requestor.uuid, target.uuid]
                            } 
                        },
                        { 
                            friendUuid: { 
                                $in: [requestor.uuid, target.uuid]
                            } 
                        }
                    ]
                }, 
                defaults: { 
                    following: false,
                    status: 'Blocked' 
                }
            }).then((friendship) => {

                if (friendship) {
                    friendship[0].update({
                        following: false,
                        status: friendship[0].status === 'Accepted' ? 'Accepted' :'Blocked'
                    }).then((result) => {
                        return res.send({
                            success: true
                        })
                    }).catch((err) => {
                        return res.send({
                            success: false,
                            message: 'Friendship does not exist'
                        })
                    })
                } else {
                    return res.send({
                        success: true
                    })
                }
            })
        }).catch((err) => {
            return res.send({
                success: false,
                message: 'Target does not exist'
            })
        })
    }).catch((err) => {
        return res.send({
            success: false,
            message: 'Requestor does not exist'
        })
    })
}

function findRecipients(req, res, next) {

    let sender = req.body.sender;
    let mentionedEmail = extractEmails(req.body.text);
    let senderUuid = "";

    User.findOne({
        where: {
            email: sender
        }
    }).then((sender) => {

        senderUuid = sender.uuid;

        Friendship.findAll({
            where: {
                $or: [
                    { userUuid: { like: '%' + sender.uuid + '%' } },
                    { friendUuid: { like: '%' + sender.uuid + '%' } }
                ],
                status: {
                    $notLike: 'Blocked'
                },
                following: true
            }
        }).then((recipients) => {

            let friendUuid = _.map(recipients, 'friendUuid');
            let userUuid = _.map(recipients, 'userUuid');
            let combinedUuid = _.concat(friendUuid, userUuid);
            let combinedUuidExcludedSelf = _.remove(combinedUuid, (elem) => { return elem !== senderUuid } );

            User.findAll({
                where: {
                    uuid: {
                        $in: combinedUuidExcludedSelf
                    }
                }
            }).then((result) => {
                return res.send({
                    success: true,
                    recipients: _.map(result, 'email'),
                    count: result.length,
                    mentionedEmail: mentionedEmail
                })
            })

        }).catch((err) => {
            return res.send({
                success: false,
                message: 'Recipients does not exist'
            })
        })
    }).catch((err) => {
        return res.send({
            success: false,
            message: 'Sender does not exist'
        })
    })
}

export default {
    list,
    addFriend,
    findFriends,
    commonFriends,
    subscribe,
    blockUser,
    findRecipients
}
