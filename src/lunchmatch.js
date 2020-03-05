import { parseGroups } from './match';
import { initChannels, retrieveUserMap } from './postToSlack';
import { retrieveOnlyOptInUsers } from './getUsersFromSheets';
import * as dotenv from "dotenv";

dotenv.config();
const testEmails = ['zack@havenlife.com'];


retrieveUserMap()
.then((userMap) => {
  // console.log(userMap);
  retrieveOnlyOptInUsers()
  .then((slackEmails) => {
    // initChannels(getBestGroup(slackEmails), userMap);
    initChannels(getBestGroup(testEmails, pastGroups, 100), userMap);
  });
});