import Promise from 'polyfill-promise';
import {getGoogleSheetUsers } from './getSheets';
import { getNextLunch, getDateCogetGoogleSheetUserslumn } from './getNextLunchDate';
import { formatForGeneral, getUsers } from './parseNames';
import { initChannels, postToSlack, createMessage, retrieveUserMap } from './postToSlack';
import { retrieveOnlyOptInUsers } from './getUsersFromSheets';
import * as dotenv from "dotenv";
import * as _ from 'lodash';

const shuffle = (array) => {
    array.sort(() => Math.random() - 0.5);
}

export const parseGroups = (names) => {
    let groups = [];
    const maxSize = 4;

    shuffle(names);
    for (let i = 0; i < names.length; i += maxSize) {
        let temp = names.slice(i, i + maxSize);
        groups.push(temp);
    }
    if (names.length % maxSize === 1) {
      groups[groups.length - 1].push(groups[0][0]);
      groups[0] = groups[0].slice(1, maxSize);
    }
    // console.log(groups);
    return groups;
}

// groups is the return of parseGroups (a list of lists of users), while allPastGroups is a list of [lists of groups], in order of recency (most recent group is first)
export const assessGroup = (groups, allPastGroups) => {
  let accumScore, overlapsInGroup;
  const scorePerGroup = allPastGroups.map(onePastGroups => {
    accumScore = 0;
    groups.forEach(group => {
      onePastGroups.forEach(pastGroup => {
        overlapsInGroup = 0;
        pastGroup.forEach(pastGroupMember => {
          overlapsInGroup = group.includes(pastGroupMember) ? overlapsInGroup + 1 : overlapsInGroup;
        });
        accumScore = overlapsInGroup > 1 ? accumScore + Math.pow((overlapsInGroup - 1), 2) : accumScore; // this power is some way to make groups of 3 or 4 matching even WORSE
      });
    });
    return accumScore;
  });
  // iterate through allPastGroups and calculate score for each one
  const totalScore = scorePerGroup.reduce((scoreSoFar, groupScore, groupIndex) => scoreSoFar + groupScore * Math.pow(.8, groupIndex), 0);
  return totalScore;
}

export const getBestGroup = (names, allPastGroups, iterations) => {
  //console.log('All past groups:, allPastGroups);
  let bestScore = Infinity;
  let bestGroups, tempGroups, tempScore;
  for (let i = 0; i < iterations; i++) {
    tempGroups = parseGroups(names);
    // console.log('A matching:', tempGroups);
    tempScore = assessGroup(tempGroups, allPastGroups);
    // console.log('The score is:', tempScore);
    if (tempScore < bestScore) {
      bestGroups = tempGroups;
      bestScore = tempScore;

    }
  }
  console.log('The best matching was:', bestGroups, 'with', bestScore);
  return bestGroups;
}


// const namesTest = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
// const allPastGroupsTest = [
// [ [ 3, 2, 7 ], [ 9, 5, 10 ], [ 11, 1, 8 ], [ 6, 4 ] ],
// [ [ 10, 2, 11 ], [ 6, 1, 9 ], [ 8, 3, 5 ], [ 7, 4 ] ],
// [ [ 2, 8, 6 ], [ 1, 10, 3 ], [ 7, 11, 5 ], [ 9, 4 ] ], 
// [ [ 8, 4, 10 ], [ 3, 11, 9 ], [ 6, 5, 2 ], [ 7, 1 ] ],
// [ [ 4, 3, 11 ], [ 8, 6, 10 ], [ 2, 9, 5 ], [ 1, 7 ] ]]
// const names = [];
export const allPastGroups = [[
  [
    'karencam@havenlife.com',
    'alex@havenlife.com',
    'ari@havenlife.com',
    'franklin@havenlife.com'
  ],
  [
    'yisheng.tang@havenlife.com',
    'lester@havenlife.com',
    'kamran@havenlife.com',
    'wei@havenlife.com'
  ],
  [
    'karenhan@havenlife.com',
    'richard@havenlife.com',
    'eli@havenlife.com',
    'gabesch@havenlife.com'
  ],
  [
    'tova@havenlife.com',
    'zack@havenlife.com',
    'igor@havenlife.com',
    'nsedlacek@havenlife.com'
  ],
  [
    'morellana@havenlife.com',
    'brittanylee@havenlife.com',
    'michael@havenlife.com',
    'nicolepark@havenlife.com'
  ],
  [
    'mark@havenlife.com',
    'brian@havenlife.com',
    'hannah.farnham@havenlife.com',
    'brianleu@havenlife.com'
  ],
  [
    'aneesha@havenlife.com',
    'ewellk@havenlife.com',
    'tisha@havenlife.com',
    'kathryn@havenlife.com'
  ],
  [
    'sushal@havenlife.com',
    'jacob@havenlife.com',
    'kateguzik@havenlife.com',
    'gabe@havenlife.com'
  ],
  [
    'shanks@havenlife.com',
    'nickeaket@havenlife.com',
    'adamhamot@havenlife.com',
    'laura@havenlife.com'
  ],
  [
    'james@havenlife.com',
    'ashley@havenlife.com',
    'roberto@havenlife.com',
    'ppennelli@havenlife.com'
  ],
  [
    'matteo@havenlife.com',
    'hannahmctigue@havenlife.com',
    'sambrandt@havenlife.com',
    'anja@havenlife.com'
  ],
  [
    'reeve@havenlife.com',
    'khuyen@havenlife.com',
    'sara@havenlife.com',
    'elle@havenlife.com'
  ],
  [
    'steve@havenlife.com',
    'sararadin@havenlife.com',
    'nathan@havenlife.com',
    'rashmi@havenlife.com'
  ]]];

// getBestGroup(namesTest, allPastGroupsTest, 10000);
// console.log(parseGroups(namesTest));