import { parseGroups } from './match';
import { initChannels, retrieveUserMap } from './postToSlack';
import { retrieveOnlyOptInUsers } from './getUsersFromSheets';
import * as dotenv from "dotenv";

dotenv.config();
process.env.dryrun = process.argv.includes('--dry-run');


retrieveUserMap()
.then((userMap) => {
  // console.log(userMap);
  retrieveOnlyOptInUsers()
  .then((slackEmails) => {
  //   initChannels(parseGroups(slackNames), userMap);
    initChannels(parseGroups(slackEmails), userMap);
  });
});