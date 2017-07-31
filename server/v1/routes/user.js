import express from 'express';
import validate from 'express-validation';
import userCtrl from '../controllers/user';
import paramValidation from '../../helpers/param-validation';

const router = express.Router();

export default function () {
    /**
     * POST /api/user/
     * retrieve list of users
     */
    router.route('/')
        .post(userCtrl.list);

    /**
     * POST /api/user/
     * establish relationship between 2 users
     * params: 
     * { friends: [ email1, email2 ] }
     */
    router.route('/addFriend')
        .post(
            validate(paramValidation.addFriend),
            userCtrl.addFriend
        );

    // router.route('/updateStatus')
    //     .put(
    //         validate(paramValidation.updateStatus),
    //         userCtrl.updateStatus
    //     );

    router.route('/findFriends')
        .post(
            validate(paramValidation.findFriends),
            userCtrl.findFriends
        )

    router.route('/commonFriends')
        .post(
            validate(paramValidation.commonFriends),
            userCtrl.commonFriends
        )

    router.route('/subscribe')
        .post(
            validate(paramValidation.subscribe),
            userCtrl.subscribe
        )
    
    router.route('/blockUser')
        .post(
            validate(paramValidation.blockUser),
            userCtrl.blockUser
        )

    router.route('/findRecipients')
        .post(
            validate(paramValidation.findRecipients),
            userCtrl.findRecipients
        )

    return router;
}
