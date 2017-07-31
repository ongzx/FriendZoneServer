import express from 'express';
import fakeDataGenerator from '../../helpers/fake-data-generator';
import userRoutes from './user';

const router = express.Router();

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) => {
    return res.send({
        success: true,
        message: "Server is online."
    });
});

/** GET /seed-users - Generate fake users */
router.get('/seed-users', (req, res) => {
    fakeDataGenerator.generateFakeUsers()
        .then(() => {
            return res.json({
                success: true,
                message: 'Users are seeded.'
            })
        })
})

router.use('/user', userRoutes());

module.exports = router;
