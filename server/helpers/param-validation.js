import Joi from 'joi';

export default {
    addFriend: {
        body: {
            friends: Joi.array().max(2).required()
        }
    },
    updateStatus: {
        body: {
            email: Joi.string().email().required(),
            status: Joi.string().required()
        }
    },
    findFriends: {
        body: {
            email: Joi.string().email().required()
        }
    },
    commonFriends: {
        body: {
            friends: Joi.array().max(2).required()
        }
    },
    subscribe: {
        body: {
            requestor: Joi.string().email().required(),
            target: Joi.string().email().required()
        }
    },
    blockUser: {
        body: {
            requestor: Joi.string().email().required(),
            target: Joi.string().email().required()
        }
    },
    findRecipients: {
        body: {
            sender: Joi.string().email().required(),
            text: Joi.string().required()
        }
    }
}