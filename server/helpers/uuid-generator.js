import Uuid from 'node-uuid';

function generate(tableName) {
    let uuid = "";

    switch(tableName) {
        case 'Users':
            uuid += 'U';
            break;

        case 'Relationships':
            uuid += 'R';
            break;

        case 'Status':
            uuid += 'S';
            break;

        default:
            break;
    }

    return uuid + Uuid.v1().replace(/-/g, "");
}

export default { generate }; 