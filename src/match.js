import Promise from 'polyfill-promise';
import {getGoogleSheetUsers } from './getSheets';
//import { getNextLunch, getDateCogetGoogleSheetUserslumn } from './getNextLunchDate';
// import { formatForGeneral, getUsers } from './parseNames';
import { initChannels, postToSlack, createMessage, retrieveUserMap } from './postToSlack';
import * as dotenv from "dotenv";
import * as _ from 'lodash';

dotenv.config();

// const slackNames = ['zacknotzach', 'kamran', 'jacob', 'KarenCam Angelo', 'igor'];
const slackEmails = ['zack@havenlife.com', 'jacob@havenlife.com', 'kamran@havenlife.com'];

const shuffle = (array) => {
    array.sort(() => Math.random() - 0.5);
}
// getGoogleSheetUsers.then(value => {
//   console.log(value);
// });

const parseGroups = (names) => {
    let groups = [];
    const maxSize = 4;
    names.filter((a, b) => name.indexOf(a) === b); // filter duplicates
    shuffle(names);
    for (let i = 0; i < names.length; i += maxSize) {
        let temp = names.slice(i, i + maxSize);
        groups.push(temp);
    }
    if (names.length % maxSize === 1) {
      groups[groups.length - 1].push(groups[0][0]);
      groups[0] = groups[0].slice(1, maxSize);
    }
    console.log(groups);
    return groups;
}

// const cleanNames = (names) => {return names.map(name => name[0] === '@' ? name.substring(1) : name)};

retrieveUserMap()
.then((userMap) => {
  console.log(userMap);
  // getGoogleSheetUsers.then((slackNames)=>{
  //   initChannels(parseGroups(slackNames), userMap);
  initChannels(parseGroups(slackEmails), userMap);
  // });
});