import Promise from 'polyfill-promise';
// import { getLunch, getSlackNames } from './getSheets';
// import { getNextLunch, getDateColumn } from './getNextLunchDate';
// import { formatForGeneral, getUsers } from './parseNames';
import { initChannels, postToSlack, createMessage, retrieveUserMap } from './postToSlack';
import * as dotenv from "dotenv";
import * as _ from 'lodash';

dotenv.config();

const slackNames = ['zacknotzach', 'kamran', 'jacob', 'KarenCam Angelo', 'igor'];

const shuffle = (array) => {
    array.sort(() => Math.random() - 0.5);
}

const parseGroups = (names) => {
    let groups = [];
    const maxSize = 5;
    shuffle(names);
    for (let i = 0; i < names.length; i += maxSize) {
        let temp = names.slice(i, i + maxSize);
        groups.push(temp);
    }
    console.log(groups);
    return groups;
}

retrieveUserMap()
.then((userMap) => {
    initChannels(parseGroups(slackNames), userMap);
});


