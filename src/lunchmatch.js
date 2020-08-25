import { parseGroups, getBestGroup, allPastGroups } from './match';
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
    //console.log('All emails: ', slackEmails);
    initChannels(getBestGroup(slackEmails, allPastGroups, 1000), userMap);
    //initChannels(parseGroups(testEmails), userMap);
  });
});