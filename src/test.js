import { getUserIDsFromNames, retrieveUserMap } from './postToSlack';
import * as dotenv from 'dotenv';

dotenv.config();
retrieveUserMap()
.then((userMap) => {
    let ids = getUserIDsFromNames(userMap, ['jacob', 'kamran', 'zacknotzach', 'zack', 'shanks']);
    console.log(ids);
});