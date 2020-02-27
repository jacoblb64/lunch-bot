import Promise from 'polyfill-promise';
import {getGoogleSheetUsers } from './getSheets';
import { getNextLunch, getDateCogetGoogleSheetUserslumn } from './getNextLunchDate';
import { formatForGeneral, getUsers } from './parseNames';
import { initChannels, postToSlack, createMessage, retrieveUserMap } from './postToSlack';
import { retrieveOnlyOptInUsers } from './getUsersFromSheets';
import * as dotenv from "dotenv";
import * as _ from 'lodash';

dotenv.config();
process.env.dryrun = process.argv.includes('--dry-run');

// const slackNames = ['zacknotzach', 'kamran', 'jacob', 'KarenCam Angelo', 'igor'];
// const slackEmails = ['zack@havenlife.com', 'jacob@havenlife.com', 'kamran@havenlife.com'];

const shuffle = (array) => {
    array.sort(() => Math.random() - 0.5);
}

const parseGroups = (optIns, optOuts) => {
    let groups = [];
    const maxSize = 4;
    // filter duplicates and remove optOuts
    // optIns.filter((a, b) => name.indexOf(a) === b); 
    // optOuts.filter((a, b) => name.indexOf(a) === b);
    // optIns.filter(user => !optOuts.includes(user));

    shuffle(optIns);
    for (let i = 0; i < optIns.length; i += maxSize) {
        let temp = names.slice(i, i + maxSize);
        groups.push(temp);
    }
    if (optIns.length % maxSize === 1) {
      groups[groups.length - 1].push(groups[0][0]);
      groups[0] = groups[0].slice(1, maxSize);
    }
    console.log(groups);
    return groups;
}

// const cleanNames = (names) => {return names.map(name => name[0] === '@' ? name.substring(1) : name)};

retrieveUserMap()
.then((userMap) => {
  // console.log(userMap);
  retrieveOnlyOptInUsers()
  .then((slackEmails) => {
  //   initChannels(parseGroups(slackNames), userMap);
    initChannels(parseGroups(slackEmails), userMap);
  });
});