import Promise from 'polyfill-promise';
import { getLunch, getSlackNames } from './getSheets';
import { getNextLunch, getDateColumn } from './getNextLunchDate';
import { formatForGeneral, getUsers } from './parseNames';
import { postToSlack } from './postToSlack';
import * as dotenv from "dotenv";
import * as _ from 'lodash';

dotenv.config();

const slackNames = ['@zacknotzach', '<@kamran>', '<@jacob>'];

// const msg = 'Hello to ' + _.sample(slackNames);
const msg = `hello to <@zacknotzach>`;
postToSlack('#lunch-bot-test-channel', msg)

