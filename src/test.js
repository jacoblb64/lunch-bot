import { getUserIDsFromNames, retrieveUserMap } from './postToSlack';
import * as dotenv from 'dotenv';
import { WebClient } from '@slack/web-api';

dotenv.config();
retrieveUserMap()
.then((userMap) => {
    let ids = getUserIDsFromNames(userMap, ['jacob', 'kamran', 'zacknotzach', 'zack', 'shanks']);
    return ids;
})
.then((ids) => {
    console.log(ids);
    const slack = new WebClient(process.env.slackToken);
    slack.chat.postMessage({
        text: `hello to @jacob` + ids[0],
        channel: process.env.groupID,
        link_names: false
    });
}).then();

