import path from 'path';
import _ from 'lodash';
import dotenv from 'dotenv';

dotenv.config();

const env = process.env.NODE_ENV;
const config = require(`./${env}`);

const defaults = {
    root: path.join(__dirname, '/..')
}

_.assign(config, defaults);

export default config;