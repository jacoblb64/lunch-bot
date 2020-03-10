import { parseGroups, getBestGroup, allPastGroups } from './match';
import { initChannels, retrieveUserMap, requestOpt } from './postToSlack';
import { retrieveOnlyOptInUsers, retrieveAllUsers } from './getUsersFromSheets';
import * as dotenv from "dotenv";

dotenv.config();
const testEmails = ['zack@havenlife.com'];


retrieveUserMap()
.then((userMap) => {
  // retrieveOnlyOptInUsers()
  retrieveAllUsers()
  .then((slackEmails) => {
    // requestOpt(slackEmails, userMap); // TEST
    requestOpt(testEmails, userMap);
  });
});