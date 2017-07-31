import faker from 'faker';
import uuidGenerator from './uuid-generator';
import { User } from '../v1/models';

function generateFakeUsers() {
    console.log("Generating fake users...");
    return Promise.resolve(0).then(function loop(i) {
        if ( i < 20) {
            return fakeSingleUser().thenReturn(i + 1).then(loop);
        }
    }).then(() => {
        console.log('All users are created successfully.');
    })
}

function fakeSingleUser() {
    let user = {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email()
    };

    return User.create(user)
        .then(function(user) {
            console.log('User created.')
        })
        .catch(function(err) {
            console.log('Error in creating user: '+ err);
        })
}

export default {
    generateFakeUsers
}